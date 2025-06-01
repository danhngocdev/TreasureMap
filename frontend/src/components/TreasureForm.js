import React, { useState } from "react";
import {
  Container,
  TextField,
  Button,
  Grid,
  Typography,
} from "@mui/material";
import axios from "axios";

const TreasureMapForm = () => {
  const [rows, setRows] = useState(3);
  const [cols, setCols] = useState(3);
  const [p, setP] = useState(3);
  const [matrix, setMatrix] = useState(Array.from({ length: 3 }, () => Array(3).fill(1)));
  const [result, setResult] = useState(null);

  const handleMatrixChange = (r, c, value) => {
    const newMatrix = matrix.map((row) => [...row]);
    newMatrix[r][c] = Number(value);
    setMatrix(newMatrix);
  };

  const handleResize = () => {
    const newMatrix = Array.from({ length: rows }, (_, r) =>
      Array.from({ length: cols }, (_, c) => (matrix[r]?.[c] || 1))
    );
    setMatrix(newMatrix);
  };

  const handleSubmit = async () => {
    // Validate input
    if (!validate()) {
      alert("Vui lòng nhập đúng dữ liệu!");
      return;
    }

    try {
      const res = await axios.post("https://localhost:7282/api/treasure", {
        rows,
        cols,
        p,
        matrix,
      });
      setResult(res.data);
    } catch (err) {
      console.error(err);
      alert("Error");
    }
  };

  const validate = () => {
    if (rows <= 0 || cols <= 0 || p <= 0) return false;
    for (let i = 0; i < rows; i++) {
      if (matrix[i].length !== cols) return false;
      for (let j = 0; j < cols; j++) {
        const val = matrix[i][j];
        if (val < 1 || val > p) return false;
      }
    }
    return true;
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
       Kho Báu
      </Typography>

      <Grid container spacing={2} alignItems="center">
        <Grid item>
          <TextField
            label="(n)"
            type="number"
            value={rows}
            onChange={(e) => setRows(+e.target.value)}
            onBlur={handleResize}
          />
        </Grid>
        <Grid item>
          <TextField
            label="(m)"
            type="number"
            value={cols}
            onChange={(e) => setCols(+e.target.value)}
            onBlur={handleResize}
          />
        </Grid>
        <Grid item>
          <TextField
            label="(p)"
            type="number"
            value={p}
            onChange={(e) => setP(+e.target.value)}
          />
        </Grid>
      </Grid>

      <Grid container spacing={1} sx={{ mt: 3 }}>
        {matrix.map((row, r) => (
          <Grid container item spacing={1} key={r}>
            {row.map((val, c) => (
              <Grid item key={c}>
                <TextField
                  type="number"
                  value={val}
                  onChange={(e) => handleMatrixChange(r, c, e.target.value)}
                  inputProps={{ min: 1, max: p }}
                  style={{ width: 60 }}
                />
              </Grid>
            ))}
          </Grid>
        ))}
      </Grid>

      <Button
        variant="contained"
        color="primary"
        onClick={handleSubmit}
        sx={{ mt: 3 }}
      >
        Send
      </Button>

      {result !== null && (
        <Typography variant="h6" sx={{ mt: 2 }}>
          Result: {Number(result).toFixed(5)}
        </Typography>
      )}
    </Container>
  );
};

export default TreasureMapForm;
