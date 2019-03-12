package com.example.myapplication;

import android.util.Log;

import java.util.Arrays;

public class KalmanFilterManager {
    private Matrix A;
    private Matrix B;
    private Matrix U;
    private float timestep = 5;

    public KalmanFilterManager(float input){
        //A -> State transition matrix.
        // [ 1 , timestep ]
        // [ 0 ,    1     ]

        A = new Matrix(2,2);
        A.setData(1,timestep,0,1);

        //B -> Control Matrix
        // [ 0.5*timestep^2 ]
        // [     timestep   ]

        B = new Matrix(2,1);
        B.setData((Math.pow(timestep,2)*0.5),timestep);

        //U -> Control Vector
        //[a]

        U = new Matrix(1,1);
        U.setData(input);
    }

    public void predict() {
    }
}
