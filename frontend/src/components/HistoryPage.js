import React, { useEffect, useState } from "react";
import {
  Table, TableBody, TableCell, TableContainer, TableHead,
  TableRow, Paper, Typography, Button, Snackbar
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function HistoryPage() {
  const [history, setHistory] = useState([]);
  const [snackbarMsg, setSnackbarMsg] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      const res = await axios.get("https://localhost:7282/api/treasure/history");
      setHistory(res.data);
    } catch (err) {
      console.error("Lỗi tải lịch sử", err);
    }
  };

  const handleResolveAgain = async (id) => {
    try {
      const res = await axios.put(`https://localhost:7282/api/treasure/resolve/${id}`);
      setSnackbarMsg(` Kết quả mới: ${res.data.result.toFixed(5)}`);
      loadHistory();
    } catch (err) {
      setSnackbarMsg(" Lỗi khi giải lại");
    }
  };

  return (
    <div style={{ padding: "2rem" }}>
      <Typography variant="h4" gutterBottom>📜 Lịch sử giải bài toán</Typography>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>⏱ Thời gian</TableCell>
              <TableCell>Kích thước</TableCell>
              <TableCell>p</TableCell>
              <TableCell>Kết quả</TableCell>
              <TableCell>Hành động</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {history.map(item => (
              <TableRow key={item.id}>
                <TableCell>{new Date(item.createdAt).toLocaleString()}</TableCell>
                <TableCell>{item.rows} x {item.cols}</TableCell>
                <TableCell>{item.p}</TableCell>
                <TableCell>{item.result.toFixed(5)}</TableCell>
                <TableCell>
                  <Button size="small" onClick={() => navigate(`/history/${item.id}`)}>
                    🔍 Xem chi tiết
                  </Button>
                  <Button size="small" onClick={() => handleResolveAgain(item.id)}>
                    🔁 Giải lại
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Snackbar
        open={!!snackbarMsg}
        autoHideDuration={4000}
        onClose={() => setSnackbarMsg("")}
        message={snackbarMsg}
      />
    </div>
  );
}