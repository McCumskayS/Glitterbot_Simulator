package com.example.myapplication;

import android.content.Context;
import android.hardware.Sensor;
import android.hardware.SensorEvent;
import android.hardware.SensorEventListener;
import android.hardware.SensorManager;
import android.os.Bundle;
import android.support.v7.app.AppCompatActivity;
import android.util.Log;
import android.widget.TextView;

import android.support.v4.app.FragmentActivity;
import com.google.android.gms.maps.CameraUpdateFactory;
import com.google.android.gms.maps.GoogleMap;
import com.google.android.gms.maps.OnMapReadyCallback;
import com.google.android.gms.maps.SupportMapFragment;
import com.google.android.gms.maps.model.LatLng;
import com.google.android.gms.maps.model.MarkerOptions;


import java.util.Locale;

public class MainActivity extends AppCompatActivity implements SensorEventListener, OnMapReadyCallback{
    private SensorManager sensorManager;
    private Sensor accelerometer;
    private Sensor rotation;
    private TextView linearAccelerationText;
    private TextView absoluteAccelerationText;
    private TextView rotationMatrixText;
    private float[] rotationMatrix;
    private float[] rotationMatrixInv;
    private float[] absoluteAcceleration;
    private float[] linearAcceleration;
    boolean rotationMatrixCreated = false;
    String linearString;
    String absoluteString;

    private GoogleMap mMap;


    @Override
    protected void onCreate(Bundle savedInstanceState) {
        Log.d("onCreate", "I'm here");
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        sensorManager = (SensorManager) getSystemService(Context.SENSOR_SERVICE);
        accelerometer = sensorManager.getDefaultSensor(Sensor.TYPE_LINEAR_ACCELERATION);
        rotation = sensorManager.getDefaultSensor(Sensor.TYPE_ROTATION_VECTOR);
        sensorManager.registerListener(this, accelerometer, SensorManager.SENSOR_DELAY_NORMAL);
        sensorManager.registerListener(this, rotation, SensorManager.SENSOR_DELAY_NORMAL);

        //Getting textViews
        linearAccelerationText = findViewById(R.id.linearAcceleration);
        absoluteAccelerationText = findViewById(R.id.linearAccelerationTest);
        rotationMatrixText = findViewById(R.id.rotationMatrix);

        rotationMatrix = new float[16];
        absoluteAcceleration = new float[4];
        linearAcceleration = new float[4];
        rotationMatrixInv = new float[16];

        SupportMapFragment mapFragment = (SupportMapFragment) getSupportFragmentManager()
                .findFragmentById(R.id.map);
        mapFragment.getMapAsync(this);
    }

    @Override
    public void onSensorChanged(SensorEvent event) {
        Log.d("sensorChanged", "I'm here");
        if (event.sensor.getType() == Sensor.TYPE_LINEAR_ACCELERATION) {
            System.arraycopy(event.values, 0, linearAcceleration, 0, event.values.length);
            if (rotationMatrixCreated) {
                android.opengl.Matrix.multiplyMV(absoluteAcceleration, 0, rotationMatrixInv, 0 , linearAcceleration, 0);

                //Setting the linear acceleration values in a string
                linearString = "ax = " + String.format(Locale.getDefault(), "%.3f", linearAcceleration[0])
                            + " ay = " + String.format(Locale.getDefault(), "%.3f", linearAcceleration[1])
                            + " az = " + String.format(Locale.getDefault(), "%.3f", linearAcceleration[2]);
                linearAccelerationText.setText(linearString);

                //Setting the absolute acceleration values in a string
                absoluteString = "ABS EAST = " +  String.format(Locale.getDefault(), "%.3f", absoluteAcceleration[0])
                              + " ABS NORTH = " + String.format(Locale.getDefault(), "%.3f", absoluteAcceleration[1])
                              + " ABS DOWN = " +  String.format(Locale.getDefault(), "%.3f", absoluteAcceleration[2]);
                absoluteAccelerationText.setText(absoluteString);
            }
        }

        if (event.sensor.getType() == Sensor.TYPE_ROTATION_VECTOR) {
            SensorManager.getRotationMatrixFromVector(rotationMatrix, event.values);
            android.opengl.Matrix.invertM(rotationMatrixInv, 0, rotationMatrix, 0);
            rotationMatrixCreated = true;
        }
    }

    @Override
    public void onAccuracyChanged(Sensor sensor, int accuracy) {

    }

    @Override
    public void onMapReady(GoogleMap googleMap) {
        mMap = googleMap;

        // Add a marker in Sydney, Australia, and move the camera.
        LatLng sydney = new LatLng(-34, 151);
        mMap.addMarker(new MarkerOptions().position(sydney).title("Marker in Sydney"));
        mMap.moveCamera(CameraUpdateFactory.newLatLng(sydney));

    }

}
