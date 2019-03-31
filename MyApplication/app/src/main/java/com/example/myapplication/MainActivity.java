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
import android.os.Bundle;
import android.support.v4.app.ActivityCompat;
import android.support.v7.app.AppCompatActivity;
import android.util.Log;
import android.widget.TextView;

import com.github.nkzawa.socketio.client.IO;
import com.github.nkzawa.socketio.client.Socket;
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
//import com.google.android.gms.maps.model.Circle;
import com.google.android.gms.maps.model.CircleOptions;
import com.google.android.gms.maps.model.LatLng;
//import com.google.android.gms.maps.model.MarkerOptions;
import com.google.android.gms.tasks.OnSuccessListener;

import java.net.URISyntaxException;
import java.util.Locale;

import static com.example.myapplication.Coordinates.latitudeToMeters;
import static com.example.myapplication.Coordinates.longitudeToMeters;
import static com.example.myapplication.Coordinates.metersToGeoPoint;

public class MainActivity extends AppCompatActivity implements SensorEventListener, OnMapReadyCallback {
    //Socket testing
    private Socket socket;


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
    boolean isKalmanInitialised = false;
    String linearString;
    String absoluteString;

    private KalmanFilterManager kalmanFilterLat;
    private KalmanFilterManager kalmanFilterLon;
    private GoogleMap mMap;

    protected void createLocationRequest() {
        locationRequest = new LocationRequest();
        locationRequest.setInterval(0);
        locationRequest.setFastestInterval(0);
        locationRequest.setPriority(LocationRequest.PRIORITY_HIGH_ACCURACY);
    }

    private void startLocationUpdates() {
        if (ActivityCompat.checkSelfPermission(this,
                Manifest.permission.ACCESS_FINE_LOCATION) != PackageManager.PERMISSION_GRANTED &&
                ActivityCompat.checkSelfPermission(this,
                        Manifest.permission.ACCESS_COARSE_LOCATION) != PackageManager.PERMISSION_GRANTED) {
            return;
        }
        fusedLocationClient.requestLocationUpdates(locationRequest, locationCallback, getMainLooper());
    }

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        //socket testing
        try {
            socket = IO.socket("http://10.154.141.170:3000");
            socket.connect();
            String message = "Hello by app";
            String data = "YOLOOOOO";
            socket.emit("test-drone", data);
        } catch (URISyntaxException e) {
            e.printStackTrace();
        }






        //Usual android initial setup
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        //Setting up sensorManagers and GPS managers
        fusedLocationClient = LocationServices.getFusedLocationProviderClient(this);
        createLocationRequest();
        sensorManager = (SensorManager) getSystemService(Context.SENSOR_SERVICE);
        accelerometer = sensorManager.getDefaultSensor(Sensor.TYPE_LINEAR_ACCELERATION);
        rotation = sensorManager.getDefaultSensor(Sensor.TYPE_ROTATION_VECTOR);
        sensorManager.registerListener(this, accelerometer, SensorManager.SENSOR_DELAY_NORMAL);
        sensorManager.registerListener(this, rotation, SensorManager.SENSOR_DELAY_NORMAL);

        //Getting textViews
        linearAccelerationText = findViewById(R.id.linearAcceleration);
        absoluteAccelerationText = findViewById(R.id.absoluteAcceleration);

        //Creating the necessary array that will be used for the absolute acceleration calculations
        rotationMatrix = new float[16];
        absoluteAcceleration = new float[4];
        linearAcceleration = new float[4];
        rotationMatrixInv = new float[16];

        //Enable map on the bottom side of the main screen
        SupportMapFragment mapFragment = (SupportMapFragment) getSupportFragmentManager()
                .findFragmentById(R.id.map);
        mapFragment.getMapAsync(this);


        //Get last known location
        if (ActivityCompat.checkSelfPermission(this,
                Manifest.permission.ACCESS_FINE_LOCATION) != PackageManager.PERMISSION_GRANTED &&
                ActivityCompat.checkSelfPermission(this,
                        Manifest.permission.ACCESS_COARSE_LOCATION) != PackageManager.PERMISSION_GRANTED) {
            return;
        }
        fusedLocationClient.getLastLocation()
                .addOnSuccessListener(this, new OnSuccessListener<Location>() {
                    @Override
                    public void onSuccess(Location location) {
                        LatLng latLng = new LatLng(location.getLatitude(), location.getLongitude());
                        CameraUpdate cameraUpdate = CameraUpdateFactory.newLatLng(latLng);
                        mMap.animateCamera(cameraUpdate);
                        addCircleToMap(latLng, Color.BLUE, 0.3);
                        kalmanFilterLat = new KalmanFilterManager(latitudeToMeters(location.getLatitude()),
                                location.getSpeed()*Math.cos(location.getBearing()));
                        kalmanFilterLon = new KalmanFilterManager(longitudeToMeters(location.getLongitude()),
                                location.getSpeed()*Math.sin(location.getBearing()));
                        isKalmanInitialised = true;
                    }
                });

        locationCallback = new LocationCallback() {
            @Override
            public void onLocationResult(LocationResult locationResult) {
                if (locationResult == null) {
                    return;
                }
                for (Location location : locationResult.getLocations()) {
                    //Raw GPS readings will be plotted on the map as blue circles (1m radius)
                    LatLng latLng = new LatLng(location.getLatitude(), location.getLongitude());
                    addCircleToMap(latLng, Color.BLUE, 0.5);

                    //Kalman update phase
                    kalmanFilterLat.update(latitudeToMeters(location.getLatitude()), location.getSpeed()*Math.cos(location.getBearing()),
                           location.getAccuracy());
                    kalmanFilterLon.update(longitudeToMeters(location.getLongitude()), location.getSpeed()*Math.sin(location.getBearing()),
                          location.getAccuracy());
                    Log.d("Accuracy", "onLocationResult:" + location.getAccuracy());
                    //Plotting the updated kalman point on the map as a GREEN circle
                    GeoPoint predicted = metersToGeoPoint(kalmanFilterLon.getPoint(), kalmanFilterLat.getPoint());
                    LatLng predictedLatLng = new LatLng(predicted.Latitude, predicted.Longitude);
                    CameraUpdate cameraUpdate = CameraUpdateFactory.newLatLng(predictedLatLng);
                    mMap.animateCamera(cameraUpdate);
                    addCircleToMap(predictedLatLng, Color.GREEN, 0.5);

                }
            }
        };
        startLocationUpdates();
    }

    @Override
    public void onSensorChanged(SensorEvent event) {
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

                //Kalman predict phase
                if (isKalmanInitialised) {
                    kalmanFilterLat.predict(absoluteAcceleration[1]);
                    kalmanFilterLon.predict(absoluteAcceleration[0]);
                }
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
        //No need to do anything if accuracy changes
    }

    @Override
    public void onMapReady(GoogleMap googleMap) {
        mMap = googleMap;
    }

    public void addCircleToMap(LatLng position, int color, double size) {
        CircleOptions circleOptions = new CircleOptions()
                .center(position)
                .fillColor(color)
                .strokeColor(Color.TRANSPARENT)
                .radius(size); //meters
        mMap.addCircle(circleOptions);
        //Circle cirle = mMap.addCircle(circleOptions?);
    }
}
