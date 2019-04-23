package com.example.myapplication;


import android.util.Log;

/**
 * https://github.com/Lezh1k
 * Matrix class created by Lezh1k
 * Used to manipulate matrices.
 */

public class Matrix {
    private int rows;
    private int cols;
    public double data[][];

    /**
     * constructor for the matrix class that initialises the matrix to the cols and rows passed in.
     * @param rows - nmumber of rows.
     * @param cols - number of columns.
     */
    public Matrix(int rows, int cols) {
        this.rows = rows;
        this.cols = cols;
        data = new double[rows][cols];
    }

    /**
     * prints out the matrix values to the log for testing.
     * @param tag - tag for the message you want to display.
     */
    public void show(String tag){
        for (int i = 0; i < rows; i++) {
            for (int j = 0; j < cols; j++)
                Log.d(tag, "" + data[i][j]);
        }
    }

    /**
     * sets the data within the array to the arguments passed in.
     * @param args - array of doubles.
     */
    public void setData(double... args) {
        assert(args.length == rows * cols);
        for (int r = 0; r < rows; ++r) {
            for (int c = 0; c < cols; ++c) {
                data[r][c] = args[r*cols + c];
            }
        }
    }

    /**
     * sets the data within the array to the arguments passed in.
     * @param args - array of floats.
     */
    public void setData(float... args) {
        assert(args.length == rows * cols);
        for (int r = 0; r < rows; ++r) {
            for (int c = 0; c < cols; ++c) {
                data[r][c] = (double)args[r*cols + c];
            }
        }
    }

    /**
     * sets up an identity matrix.
     */
    public void setIdentityDiag() {
        for (int r = 0; r < rows; ++r) {
            for (int c = 0; c < cols; ++c) {
                data[r][c] = 0.0;
            }
            data[r][r] = 1.0;
        }
    }

    public void setIdentity() {
        assert(rows == cols);
        setIdentityDiag();
    }

    /**
     * adds 2 matrices ma and mb together and stores the result in mc.
     * @param ma - first matrix you want to add.
     * @param mb - second matrix you want to add too.
     * @param mc - the matrix that stores the result.
     */
    public static void matrixAdd(Matrix ma,
                                 Matrix mb,
                                 Matrix mc) {
        assert(ma != null);
        assert(mb != null);
        assert(mc != null);
        assert(ma.cols == mb.cols && mb.cols == mc.cols);
        assert(ma.rows == mb.rows && mb.rows == mc.rows);

        for (int r = 0; r < ma.rows; ++r) {
            for (int c = 0; c < ma.cols; ++c) {
                mc.data[r][c] = ma.data[r][c] + mb.data[r][c];
            }
        }
    }

    /**
     * subtracts 2 matrices ma and mb from each other and stores the result in mc.
     * @param ma - first matrix you want to subtract.
     * @param mb - matrix you want to subtract the first one from.
     * @param mc - matrix to store the result.
     */
    public static void matrixSubtract(Matrix ma,
                                      Matrix mb,
                                      Matrix mc) {
        assert(ma != null);
        assert(mb != null);
        assert(mc != null);
        assert(ma.cols == mb.cols && mb.cols == mc.cols);
        assert(ma.rows == mb.rows && mb.rows == mc.rows);

        for (int r = 0; r < ma.rows; ++r) {
            for (int c = 0; c < ma.cols; ++c) {
                mc.data[r][c] = ma.data[r][c] - mb.data[r][c];
            }
        }
    }

    /**
     * multiplies 2 matrices ma and mb together and stores the result in mc.
     * @param ma - first matrix to multiply.
     * @param mb - second matrix you want to multiply.
     * @param mc - result of multiplied matrices.
     */
    public static void matrixMultiply(Matrix ma,
                                      Matrix mb,
                                      Matrix mc) {
        assert(ma != null);
        assert(mb != null);
        assert(mc != null);
        assert(ma.cols == mb.rows);
        assert(ma.rows == mc.rows);
        assert(mb.cols == mc.cols);
        int r, c, rc;
        final int mcrows = mc.rows;
        final int mccols = mc.cols;
        final int macols = ma.cols;

        for (r = 0; r < mcrows; ++r) {
            for (c = 0; c < mccols; ++c) {
                mc.data[r][c] = 0.0;
                for (rc = 0; rc < macols; ++rc) {
                    mc.data[r][c] += ma.data[r][rc]*mb.data[rc][c];
                }
            } //for col
        } //for row
    }

    /**
     * transposes the matrix passed in.
     * @param mtxin - original matrix.
     * @param mtxout - transposed result matrix.
     */
    public static void matrixTranspose(Matrix mtxin,
                                       Matrix mtxout) {
        assert(mtxin != null);
        assert(mtxout != null);
        assert(mtxin.rows == mtxout.cols);
        assert(mtxin.cols == mtxout.rows);
        int r, c;
        for (r = 0; r < mtxin.rows; ++r) {
            for (c = 0; c < mtxin.cols; ++c) {
                mtxout.data[c][r] = mtxin.data[r][c];
            } //for col
        } //for row
    }

    /**
     * swaps 2 rows of a matrix with each other.
     * @param r1 - first row you want to swap.
     * @param r2 - second row you want to swap with.
     */
    private void swapRows(int r1, int r2) {
        assert(r1 != r2);
        double tmp[] = data[r1];
        data[r1] = data[r2];
        data[r2] = tmp;
    }

    /**
     * scales the rows of the matrix by the value passed in.
     * @param r - row that you want to scale.
     * @param scalar - number you want to scale by.
     */
    private void scaleRow(int r, double scalar) {
        assert(r < rows);
        int c;
        for (c = 0; c < cols; ++c) {
            data[r][c] *= scalar;
        }
    }


    void shearRow(int r1,
                  int r2,
                  double scalar) {
        assert(r1 != r2);
        assert(r1 < rows && r2 < rows);
        int c;
        for (c = 0; c < cols; ++c)
            data[r1][c] += data[r2][c] * scalar;
    }

    public static boolean matrixDestructiveInvert(Matrix mtxin,
                                                  Matrix mtxout) {
        assert(mtxin != null);
        assert(mtxout != null);
        assert(mtxin.cols == mtxin.rows);
        assert(mtxout.cols == mtxin.cols);
        assert(mtxout.rows == mtxin.rows);
        int r, ri;
        double scalar;
        mtxout.setIdentity();

        for (r = 0; r < mtxin.rows; ++r) {
            if (mtxin.data[r][r] == 0.0) { //we have to swap rows here to make nonzero diagonal
                for (ri = r; ri < mtxin.rows; ++ri) {
                    if (mtxin.data[ri][ri] != 0.0)
                        break;
                }

                if (ri == mtxin.rows)
                    return false;  //can't get inverse matrix

                mtxin.swapRows(r, ri);
                mtxout.swapRows(r, ri);
            } //if mtxin.data[r][r] == 0.0

            scalar = 1.0 / mtxin.data[r][r];
            mtxin.scaleRow(r, scalar);
            mtxout.scaleRow(r, scalar);

            for (ri = 0; ri < r; ++ri) {
                scalar = -mtxin.data[ri][r];
                mtxin.shearRow(ri, r, scalar);
                mtxout.shearRow(ri, r, scalar);
            }

            for (ri = r + 1; ri < mtxin.rows; ++ri) {
                scalar = -mtxin.data[ri][r];
                mtxin.shearRow(ri, r, scalar);
                mtxout.shearRow(ri, r, scalar);
            }
        } //for r < mtxin.rows
        return true;
    }
}