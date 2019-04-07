package com.example.myapplication;

public class KalmanFilterManager {
    private int gpsStandardDeviation = 1;
    private double accelerometerDeviation = 0.8;
    private Long deltaTime;
    private Long prevTime;
    private Long currentTime;

    private Matrix A; //State transition model
    private Matrix B; //Control Matrix
    private Matrix Pk; //Process error
    private Matrix Q; //Accelerometer covariance
    private Matrix Acc; //Control Vector 1x1, acceleration
    private Matrix State; //State
    private Matrix R; //GPS covariance error
    private Matrix Z; //Observation vector
    private Matrix K; //Kalman Gain
    private Matrix I; //Identity Matrix

    //In-between Matrices used for state predictions
    private Matrix AS;
    private Matrix BAcc;

    //In-between Matrix for Pk predictions
    private Matrix At; //A transposed
    private Matrix APk;
    private Matrix APkAt;

    //In-between Matrices for update phase
    private Matrix Z_State;
    private Matrix PkR;
    private Matrix iPkR;
    private Matrix KZ_State;
    private Matrix IK;


    public KalmanFilterManager(double position, double speed){
        //Kalman matrices
        A = new Matrix(2,2);
        B = new Matrix(2,1);
        State = new Matrix(2,1);
        Acc = new Matrix(1,1);
        Pk = new Matrix(2,2);
        Q = new Matrix(2,2);
        R = new Matrix(2,2);
        Z = new Matrix(2,1);
        K = new Matrix(2,2);
        I = new Matrix(2,2);

        //Kalman predict in-between initialisation
        APk = new Matrix(2,2);
        APkAt = new Matrix(2,2);
        At = new Matrix(2,2);
        BAcc = new Matrix(2,1);
        AS = new Matrix(2,1);

        //update phase
        Z_State = new Matrix(2, 1);
        PkR = new Matrix(2, 2);
        iPkR = new Matrix (2,2);
        KZ_State = new Matrix(2, 1);
        IK = new Matrix(2,2);

        I.setData(1,0,0,1);
        R.setData(gpsStandardDeviation*gpsStandardDeviation , 0, 0 , gpsStandardDeviation*gpsStandardDeviation);
        Pk.setData(1,0,0,1);
        Q.setData(accelerometerDeviation*accelerometerDeviation, 0, 0, accelerometerDeviation*accelerometerDeviation);
        State.setData(position, speed);
        prevTime = System.currentTimeMillis();
    }


    public void predict(double absoluteAcc) {
        currentTime = System.currentTimeMillis();
        deltaTime = currentTime - prevTime;
        deltaTime /= 1000;
        prevTime = currentTime;

        A.setData(1, deltaTime, 0 , 1);
        B.setData((Math.pow(deltaTime,2))/2, deltaTime);
        Acc.setData(absoluteAcc);

        //Calculating Xk prediction
        Matrix.matrixMultiply(A, State, AS);
        Matrix.matrixMultiply(B, Acc , BAcc);
        Matrix.matrixAdd(AS, BAcc, State);

        //Calculating Pk prediction
        Matrix.matrixMultiply(A, Pk, APk);
        Matrix.matrixTranspose(A, At);
        Matrix.matrixMultiply(APk, At, APkAt);
        Matrix.matrixAdd(APkAt, Q, Pk);
    }

    public void update(double position, double speed, double accuracy){
        //Setting new observation values
        Z.setData(position, speed);
        //Setting gps error covariance matrix
        R.setData(accuracy*accuracy, 0, 0, accuracy*accuracy);

        Matrix.matrixSubtract(Z, State, Z_State);
        Matrix.matrixAdd(Pk, R, PkR);
        Matrix.matrixDestructiveInvert(PkR, iPkR);
        Matrix.matrixMultiply(Pk, iPkR, K);

        Matrix.matrixMultiply(K, Z_State, KZ_State);
        Matrix.matrixAdd(State, KZ_State, State);

        Matrix.matrixSubtract(I, K, IK);
        Matrix.matrixMultiply(IK, Pk, Pk);
    }

    public double getPoint() {
        return State.data[0][0];
    }
}
