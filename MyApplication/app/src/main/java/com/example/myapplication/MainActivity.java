package com.example.myapplication;

import android.Manifest;
import android.content.Context;
import android.content.pm.PackageManager;
import android.graphics.Color;
import android.hardware.Sensor;
import android.hardware.SensorEvent;
import android.hardware.SensorEventListener;
import android.hardware.SensorManager;
import android.location.Location;
import android.location.LocationListener;
import android.location.LocationManager;
import android.os.Bundle;
import android.support.v4.app.ActivityCompat;
import android.support.v7.app.AppCompatActivity;
import android.util.Log;
import android.widget.TextView;

import com.google.android.gms.location.FusedLocationProviderClient;
import com.google.android.gms.location.LocationCallback;
import com.google.android.gms.location.LocationRequest;
import com.google.android.gms.location.LocationResult;
import com.google.android.gms.location.LocationServices;
import com.google.android.gms.maps.CameraUpdate;
import com.google.android.gms.maps.CameraUpdateFactory;
import com.google.android.gms.maps.GoogleMap;
import com.google.android.gms.maps.OnMapReadyCallback;
import com.google.android.gms.maps.SupportMapFragment;
import com.google.android.gms.maps.model.Circle;
import com.google.android.gms.maps.model.CircleOptions;
import com.google.android.gms.maps.model.LatLng;
import com.google.android.gms.maps.model.MarkerOptions;
import com.google.android.gms.tasks.OnSuccessListener;

import java.util.Arrays;

import java.util.Locale;

public class MainActivity extends AppCompatActivity implements SensorEventListener, OnMapReadyCallback {
    private FusedLocationProviderClient fusedLocationClient;
    private LocationRequest locationRequest;
    private LocationCallback locationCallback;

    private SensorManager sensorManager;
    private Sensor accelerometer;
    private Sensor rotation;
    private TextView linearAccelerationText;
    private TextView absoluteAccelerationText;
    private float[] rotationMatrix;
    private float[] rotationMatrixInv;
    private float[] absoluteAcceleration;
    private float[] linearAcceleration;
    boolean rotationMatrixCreated = false;
    String linearString;
    String absoluteString;

    private GoogleMap mMap;

    protected void createLocationRequest() {
        LocationRequest locationRequest = new LocationRequest();
        locationRequest.setInterval(2000);
        locationRequest.setFastestInterval(5000);
        locationRequest.setPriority(LocationRequest.PRIORITY_HIGH_ACCURACY);
    }

    private void startLocationUpdates() {
        if (ActivityCompat.checkSelfPermission(this, Manifest.permission.ACCESS_FINE_LOCATION) != PackageManager.PERMISSION_GRANTED && ActivityCompat.checkSelfPermission(this, Manifest.permission.ACCESS_COARSE_LOCATION) != PackageManager.PERMISSION_GRANTED) {
            // TODO: Consider calling
            //    ActivityCompat#requestPermissions
            // here to request the missing permissions, and then overriding
            //   public void onRequestPermissionsResult(int requestCode, String[] permissions,
            //                                          int[] grantResults)
            // to handle the case where the user grants the permission. See the documentation
            // for ActivityCompat#requestPermissions for more details.
            return;
        }
        fusedLocationClient.requestLocationUpdates(locationRequest, locationCallback, null);
    }

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        fusedLocationClient = LocationServices.getFusedLocationProviderClient(this);
        createLocationRequest();

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
        absoluteAccelerationText = findViewById(R.id.absoluteAcceleration);

        rotationMatrix = new float[16];
        absoluteAcceleration = new float[4];
        linearAcceleration = new float[4];
        rotationMatrixInv = new float[16];

        SupportMapFragment mapFragment = (SupportMapFragment) getSupportFragmentManager()
                .findFragmentById(R.id.map);
        mapFragment.getMapAsync(this);


        //Get last known location
        if (ActivityCompat.checkSelfPermission(this, Manifest.permission.ACCESS_FINE_LOCATION) != PackageManager.PERMISSION_GRANTED && ActivityCompat.checkSelfPermission(this, Manifest.permission.ACCESS_COARSE_LOCATION) != PackageManager.PERMISSION_GRANTED) {
            // TODO: Consider calling
            //    ActivityCompat#requestPermissions
            // here to request the missing permissions, and then overriding
            //   public void onRequestPermissionsResult(int requestCode, String[] permissions,
            //                                          int[] grantResults)
            // to handle the case where the user grants the permission. See the documentation
            // for ActivityCompat#requestPermissions for more details.
            return;
        }
        fusedLocationClient.getLastLocation()
                .addOnSuccessListener(this, new OnSuccessListener<Location>() {
                    @Override
                    public void onSuccess(Location location) {
                        Log.d("LocationUpdate", "Last location here");
                        LatLng latLng = new LatLng(location.getLatitude(), location.getLongitude());
                        CameraUpdate cameraUpdate = CameraUpdateFactory.newLatLng(latLng);
                        mMap.animateCamera(cameraUpdate);
                        addCircleToMap(latLng);
                    }
                });

        locationCallback = new LocationCallback() {
            @Override
            public void onLocationResult(LocationResult locationResult) {
                if (locationResult == null) {
                    return;
                }
                for (Location location : locationResult.getLocations()) {
                    LatLng latLng = new LatLng(location.getLatitude(), location.getLongitude());
                    CameraUpdate cameraUpdate = CameraUpdateFactory.newLatLng(latLng);
                    mMap.animateCamera(cameraUpdate);
                    addCircleToMap(latLng);
                }
            }
        };
        startLocationUpdates();
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
        LatLng sydney = new LatLng(52.954784, -1.158109);
        mMap.addMarker(new MarkerOptions().position(sydney).title("Marker in Sydney"));
        mMap.moveCamera(CameraUpdateFactory.newLatLng(sydney));
        addCircleToMap(sydney);
    }

    public void addCircleToMap(LatLng position) {
        CircleOptions circleOptions = new CircleOptions()
                .center(position)
                .fillColor(Color.BLUE)
                .strokeColor(Color.TRANSPARENT)
                .radius(1); //meters

        Circle circle = mMap.addCircle(circleOptions);
    }

}
