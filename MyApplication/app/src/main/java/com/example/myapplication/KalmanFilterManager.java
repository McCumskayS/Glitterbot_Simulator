package com.example.myapplication;

import android.location.Location;
import android.util.Log;

import static com.example.myapplication.Coordinates.latitudeToMeters;
import static com.example.myapplication.Coordinates.metersToGeoPoint;

public class KalmanFilterManager {
    private Long deltaTime;
    //
    private Matrix A;
    private Matrix B;
    private Matrix State;
    private Long prevTime;
    //
    private Matrix ApS;
    private Matrix Bu;
    private Matrix Acc;

    public KalmanFilterManager(Location location, boolean latOrlong){
        A = new Matrix(2,2);
        B = new Matrix(2,1);
        State = new Matrix(2,1);
        ApS = new Matrix(2,1);
        Bu = new Matrix(2,1);
        Acc = new Matrix(1,1);
        if (latOrlong) {
            State.setData(latitudeToMeters(location.getLatitude()), (location.getSpeed()*Math.cos(location.getBearing())));
        } else {
            State.setData(latitudeToMeters(location.getLongitude()), (location.getSpeed()*Math.sin(location.getBearing())));
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
        B.setData((Math.pow(deltaTime,2))/2, deltaTime);
        Acc.setData(absoluteAcc);

        Matrix.matrixMultiply(A, State, ApS);
        Matrix.matrixMultiply(B, Acc , Bu);
        Matrix.matrixAdd(ApS, Bu, State);
        State.show("updated State");
    }

    public double getPoint() {
        return State.data[0][0];
    }
}
