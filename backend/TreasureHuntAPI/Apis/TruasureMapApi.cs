using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Cryptography.Xml;
using System.Text.Json;
using TreasureHuntAPI.Models;
using TreasureHuntAPI.Services;

namespace TreasureHuntAPI.Apis
{
    public static class TruasureMapApi
    {
        public static IEndpointRouteBuilder MapTreasureMapApi(this IEndpointRouteBuilder builder)
        {
            builder.MapGet("/api/treasure/history", GetAllMaps);
            builder.MapPost("/api/treasure", SaveAndSolve);
            builder.MapGet("/api/treasure/history/{id}", GetHistory);
            builder.MapPut("/api/treasure/resolve/{id}", ResolveAgain);
            return builder;
        }


        public static async Task<IResult> SaveAndSolve([FromServices] TruasureMapServices services, [FromBody] TreasureMapDto treasureMap)
        {

            if (treasureMap.Matrix.Length != treasureMap.Rows ||
                 treasureMap.Matrix.Any(row => row.Length != treasureMap.Cols))
            {
                return Results.BadRequest("Kích thước ma trận không đúng.");
            }

            var result = Solve(treasureMap);

            var entity = new TreasureMap
            {
                Rows = treasureMap.Rows,
                Cols = treasureMap.Cols,
                P = treasureMap.P,
                MatrixJson = System.Text.Json.JsonSerializer.Serialize(treasureMap.Matrix),
                Result = result
            };
            
            services.DbContext.TreasureMaps.Add(entity);

   

            await services.DbContext.SaveChangesAsync();

            return Results.Ok(result);
        }

        public static async Task<IResult> GetAllMaps([FromServices] TruasureMapServices services)
        {
            var history = await services.DbContext.TreasureMaps
             .OrderByDescending(x => x.CreatedAt)
             .ToListAsync();

            return Results.Ok(history);
        }


        public static async Task<IResult> GetHistory([FromServices] TruasureMapServices services, [FromRoute] int Id)
        {
            var map = await services.DbContext.TreasureMaps.FindAsync(Id);
            if (map == null)
                return Results.NotFound();

            int[][] matrix;
            try
            {
                matrix = JsonSerializer.Deserialize<int[][]>(map.MatrixJson);
            }
            catch (JsonException)
            {
                return Results.BadRequest("Dữ liệu ma trận không hợp lệ");
            }

            var dto = new TreasureMapDto
            {
                Rows = map.Rows,
                Cols = map.Cols,
                P = map.P,
                Matrix = matrix
            };

            var result = Solve(dto);
            return Results.Ok(new { input = dto, result });
        }

        public static async Task<IResult> ResolveAgain([FromServices] TruasureMapServices services, [FromRoute] int Id)
        {
            var map = await services.DbContext.TreasureMaps.FindAsync(Id);
            if (map == null) return Results.NotFound();

            var matrix = JsonSerializer.Deserialize<int[][]>(map.MatrixJson);
            var dto = new TreasureMapDto
            {
                Rows = map.Rows,
                Cols = map.Cols,
                P = map.P,
                Matrix = matrix
            };

            var newResult = Solve(dto);

            map.Result = newResult;
            map.UpdatedAt = DateTime.UtcNow;
            await services.DbContext.SaveChangesAsync();

            return Results.Ok(new { result = newResult });





        }

        private static double Solve(TreasureMapDto dto)
        {
            int n = dto.Rows, m = dto.Cols, p = dto.P;
            int[][] a = dto.Matrix;

            // Lưu danh sách vị trí của từng loại rương
            List<(int x, int y)>[] pos = new List<(int, int)>[p + 1];
            for (int i = 0; i <= p; i++)
                pos[i] = new List<(int, int)>();

            for (int i = 0; i < n; i++)
                for (int j = 0; j < m; j++)
                    pos[a[i][j]].Add((i, j));

            // Khởi tạo khoảng cách lớn
            double[,] dist = new double[n, m];
            for (int i = 0; i < n; i++)
                for (int j = 0; j < m; j++)
                    dist[i, j] = double.MaxValue;

            // Nếu ô (0,0) chứa rương số 1 → khoảng cách 0, vì đã có chìa 0 rồi mở được
            if (a[0][0] == 1)
            {
                dist[0, 0] = 0;
            }
            else
            {
                // Nếu ô (0,0) không phải rương 1, khởi tạo khoảng cách đến các vị trí rương 1
                // vì phải đi từ (0,0) đến ô chứa rương 1 để lấy chìa khóa mở rương 2
                foreach (var (x, y) in pos[1])
                {
                    dist[x, y] = Math.Sqrt(x * x + y * y);
                }
            }

            // Từ rương thứ 2 đến rương thứ p, cập nhật khoảng cách
            for (int k = 2; k <= p; k++)
            {
                // Với mỗi vị trí rương k
                foreach (var (x1, y1) in pos[k])
                {
                    // Tìm min khoảng cách từ mọi vị trí rương k-1 đến rương k
                    foreach (var (x2, y2) in pos[k - 1])
                    {
                        if (dist[x2, y2] == double.MaxValue) continue;
                        double d = dist[x2, y2] + Math.Sqrt((x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2));
                        if (d < dist[x1, y1])
                            dist[x1, y1] = d;
                    }
                }
            }

            // Trả về khoảng cách nhỏ nhất tại vị trí rương p (chỉ có 1 vị trí rương p)
            var (tx, ty) = pos[p][0];
            return dist[tx, ty];
        }




    }
}
