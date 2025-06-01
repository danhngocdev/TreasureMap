import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Typography, CircularProgress, Paper } from "@mui/material";
import axios from "axios";

export default function HistoryDetail() {
  const { id } = useParams();
  const [detail, setDetail] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDetail = async () => {
      try {
        const res = await axios.get(`https://localhost:7282/api/treasure/history/${id}`);
        setDetail(res.data);
      } catch (err) {
        console.error("Lỗi tải chi tiết", err);
      } finally {
        setLoading(false);
      }
    };

    loadDetail();
  }, [id]);

  if (loading) return <CircularProgress />;
  if (!detail) return <Typography>Lỗi: không tìm thấy bản ghi</Typography>;

  return (
    <Paper style={{ padding: 16 }}>
      <Typography variant="h5"> Chi tiết giải bài toán #{id}</Typography>
      <Typography><strong>Kích thước:</strong> {detail.input.rows} x {detail.input.cols}</Typography>
      <Typography><strong>p:</strong> {detail.input.p}</Typography>
      <Typography><strong>Kết quả:</strong> {detail.result.toFixed(5)}</Typography>

      <Typography mt={2}><strong>Ma trận:</strong></Typography>
      <pre>{JSON.stringify(detail.input.matrix, null, 2)}</pre>
    </Paper>
  );
}