package com.example.myapplication;

import android.location.Location;
import android.util.Log;

import static com.example.myapplication.Coordinates.latitudeToMeters;
import static com.example.myapplication.Coordinates.longitudeToMeters;
import static com.example.myapplication.Coordinates.metersToGeoPoint;

public class KalmanFilterManager {
    private boolean latLong;
    private Long deltaTime;
    //
    private Matrix A;
    private Matrix At;
    private Matrix B;
    private Matrix Pk;
    private Matrix Q;
    private Matrix Acc;
    private Matrix State;
    private Long prevTime;

    //Inbetween Matrix for Xk
    private Matrix ApS;
    private Matrix Bu;

    //Inbetween Matrix for Pk
    private Matrix Ap;
    private Matrix ApAt;

    //update Kk
    private Matrix H;
    private Matrix Ht;
    private Matrix Hp;
    private Matrix HpHt;
    private Matrix K;
    private Matrix R;

    //update Xk
    private Matrix Hx;
    private Matrix Zh;
    private Matrix Z;

    //update Pk
    private Matrix I;

    public KalmanFilterManager(Location location, boolean latOrlong){
        latLong = latOrlong;

        A = new Matrix(2,2);
        B = new Matrix(2,1);
        State = new Matrix(2,1);
        ApS = new Matrix(2,1);
        Bu = new Matrix(2,1);
        Acc = new Matrix(1,1);
        Pk = new Matrix(2,2);
        Q = new Matrix(2,2);

        Ap = new Matrix(2,2);
        ApAt = new Matrix(2,2);
        At = new Matrix(2,2);

        //update Kk
        H = new Matrix(2,2);
        Ht = new Matrix(2,2);
        HpHt = new Matrix(2,2);
        Hp = new Matrix(2,2);
        K = new Matrix(2,2);
        R = new Matrix(2,2);

        //update Xk
        Hx = new Matrix(2,1);
        Zh = new Matrix(2,1);
        Z = new Matrix(2,1);

        //update Pk
        I = new Matrix(2,2);
        I.setData(1,0,0,1);

        R.setData(Math.pow(location.getAccuracy(),2) , 0, 0 , Math.pow(location.getAccuracy(),2));
        Pk.setData(1,0,0,1);
        H.setData(1,0,0,1);
        Matrix.matrixTranspose(H, Ht);

        Q.setData(Math.pow(0.1,2), 0, 0, Math.pow(0.1, 2));
        if (latOrlong) {
            State.setData(latitudeToMeters(location.getLatitude()), (location.getSpeed()*Math.cos(location.getBearing())));
            //Log.d("Lat real", Double.toString(location.getLatitude()));
            Log.d("Lat Before", Double.toString(latitudeToMeters(location.getLatitude())));
            Log.d("Lat vel before", Double.toString(location.getSpeed()*Math.cos(location.getBearing())));
        } else {
            State.setData(longitudeToMeters(location.getLongitude()), (location.getSpeed()*Math.sin(location.getBearing())));
            //Log.d("Long real", Double.toString(location.getLongitude()));
            Log.d("Long Before", Double.toString(longitudeToMeters(location.getLongitude())));
            Log.d("Long velocity", Double.toString(location.getSpeed()*Math.sin(location.getBearing())));
        }
        prevTime = System.currentTimeMillis();
        State.show("initial State");
    }


    public void predict(double absoluteAcc, float time) {


        State.show("previous State");
        Long ok = System.currentTimeMillis();
        deltaTime = ok - prevTime;
        deltaTime /= 1000;
        prevTime = ok;
        Log.d("time State", ""+deltaTime + "time passed: " + ok + "prevTime: " + prevTime);
        A.setData(1, deltaTime, 0 , 1);
        A.show("A");
        B.setData((Math.pow(deltaTime,2))/2, deltaTime);
        Acc.setData(absoluteAcc);

        //Calculating Xk prediction
        Matrix.matrixMultiply(A, State, ApS);
        ApS.show("ApS");
        Matrix.matrixMultiply(B, Acc , Bu);
        Bu.show("Bu");
        Matrix.matrixAdd(ApS, Bu, State);
        State.show("updated State");

        //Calculating Pk prediction
        Matrix.matrixMultiply(A,Pk,Ap);
        Matrix.matrixTranspose(A, At);
        Matrix.matrixMultiply(Ap, At, ApAt);
        Matrix.matrixAdd(ApAt, Q, Pk);
        //State.data[1][0] = 0;

        if (latLong) {
            //Log.d("Lat real", Double.toString(location.getLatitude()));
            Log.d("Lat", Double.toString(State.data[0][0]));
            Log.d("Lat Vel", Double.toString(State.data[1][0]));
        } else {
            //Log.d("Long real", Double.toString(location.getLongitude()));
            Log.d("Long", Double.toString(State.data[0][0]));
            Log.d("Long Vel", Double.toString(State.data[1][0]));

        }
    }

   /** public void update(Location location){
        //Calculating K
        Matrix.matrixMultiply(H, Pk, Hp);
        Matrix.matrixMultiply(Hp, Ht, HpHt);
        Matrix.matrixAdd(HpHt, R, Hp);

        Matrix.matrixMultiply(Pk, Ht, HpHt);
        Matrix.matrixDestructiveInvert(Hp, Hp);
        Matrix.matrixMultiply(HpHt, Hp, K);

        //Calculating Xk
        if(latLong) {
            Z.setData(location.getLatitude(), location.getSpeed());
        }else{
            Z.setData(location.getLongitude(), location.getSpeed());
        }

        Matrix.matrixMultiply(H, State, Hx);
        Matrix.matrixSubtract(Z, Hx, Zh);
        Matrix.matrixMultiply(K, Zh, Hx);
        Matrix.matrixAdd(State, Hx, State);

        //Calculating Pk
        Matrix.matrixMultiply(K, H, Hp);
        Matrix.matrixSubtract(I, Hp, HpHt);
        Matrix.matrixMultiply(HpHt, Pk, Pk);
    } **/

    public double getPoint() {
        return State.data[0][0];
    }
}
