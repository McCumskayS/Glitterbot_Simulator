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
import android.view.View;
import android.widget.Button;
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
import com.google.android.gms.maps.model.CircleOptions;
import com.google.android.gms.maps.model.LatLng;
import com.google.android.gms.tasks.OnSuccessListener;
import org.json.JSONException;
import org.json.JSONObject;
import java.net.URISyntaxException;
import java.util.Locale;
import static com.example.myapplication.Coordinates.latitudeToMeters;
import static com.example.myapplication.Coordinates.longitudeToMeters;
import static com.example.myapplication.Coordinates.metersToGeoPoint;

/**
 * Main class that has all of the main code for the application
 */
public class MainActivity extends AppCompatActivity implements SensorEventListener, OnMapReadyCallback {
    //Socket configurations
    private Socket socket;

    //button declerations
    private Button litterBtn;
    private Button startBtn;
    private Button endBtn;
    //Latitude Longitude object
    private LatLng predictedLatLng;

    //Sensor intialisation objects
    private FusedLocationProviderClient fusedLocationClient;
    private LocationRequest locationRequest;
    private LocationCallback locationCallback;
    private SensorManager sensorManager;
    private Sensor accelerometer;
    private Sensor rotation;

    private float[] rotationMatrix;
    private float[] rotationMatrixInv;
    private float[] absoluteAcceleration;
    private float[] linearAcceleration;

    boolean rotationMatrixCreated = false;
    boolean isKalmanInitialised = false;

    private KalmanFilterManager kalmanFilterLat;
    private KalmanFilterManager kalmanFilterLon;
    private GoogleMap mMap;

    /**
     * sets up intial settings for the location requests.
     */
    protected void createLocationRequest() {
        locationRequest = new LocationRequest();
        locationRequest.setInterval(0);
        locationRequest.setFastestInterval(0);
        locationRequest.setPriority(LocationRequest.PRIORITY_HIGH_ACCURACY);
    }

    /**
     * called to start location service
     */
    private void startLocationUpdates() {
        if (ActivityCompat.checkSelfPermission(this,
                Manifest.permission.ACCESS_FINE_LOCATION) != PackageManager.PERMISSION_GRANTED &&
                ActivityCompat.checkSelfPermission(this,
                        Manifest.permission.ACCESS_COARSE_LOCATION) != PackageManager.PERMISSION_GRANTED) {
            return;
        }
        fusedLocationClient.requestLocationUpdates(locationRequest, locationCallback, getMainLooper());
    }

    /**
     * socket connection is made on the first instance of the application, and the relevant variables are setup.
     * @param savedInstanceState - data stored for previous state
     */
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        //socket testing
        try {
            socket = IO.socket("http://10.154.133.165:3000");
            socket.connect();
            //String message = "Connection from app!";
            //socket.emit("test-drone", message);
        } catch (URISyntaxException e) {
            e.printStackTrace();
        }

        //Usual android initial setup
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);


        //button handling
        litterBtn = findViewById(R.id.btnAddLitter);
        startBtn = findViewById(R.id.btnStart);
        endBtn = findViewById(R.id.btnEnd);

        litterBtn.setOnClickListener(new View.OnClickListener() {
            /**
             * when litterBtn is clicked the current latitude and longitude are send to the server via a socket.
             * @param v - the button that was clicked.
             */
              @Override
              public void onClick(View v) {
                  JSONObject data = new JSONObject();
                  try {
                      data.put("latitude", latitudeToMeters(predictedLatLng.latitude));
                      data.put("longitude", longitudeToMeters(predictedLatLng.longitude));
                  } catch (JSONException e) {
                      // TODO Auto-generated catch block
                      e.printStackTrace();
                  }
                socket.emit("test-drone" , data);
              }
        });

        startBtn.setOnClickListener(new View.OnClickListener() {
            /**
             * action that is performed when startBtn is clicked.
             * @param v - the button that was clicked.
             */
            @Override
            public void onClick(View v) {
                JSONObject data = new JSONObject();
                try {
                   data.put("latitude", latitudeToMeters(predictedLatLng.latitude));
                   data.put("longitude", longitudeToMeters(predictedLatLng.longitude));
                } catch (JSONException e) {
                    // TODO Auto-generated catch block
                    e.printStackTrace();
                }
                socket.emit("app-startPos" , data);
            }
        });

        endBtn.setOnClickListener(new View.OnClickListener() {
            /**
             * action that is performed when endBtn is clicked.
             * @param v - the button that was clicked.
             */
            @Override
            public void onClick(View v) {
                JSONObject data = new JSONObject();
                try {
                    data.put("latitude", latitudeToMeters(predictedLatLng.latitude));
                    data.put("longitude", longitudeToMeters(predictedLatLng.longitude));
                } catch (JSONException e) {
                    // TODO Auto-generated catch block
                    e.printStackTrace();
                }
                socket.emit("app-endPos" , data);
            }
        });


        //Setting up sensorManagers and GPS managers
        fusedLocationClient = LocationServices.getFusedLocationProviderClient(this);
        createLocationRequest();
        sensorManager = (SensorManager) getSystemService(Context.SENSOR_SERVICE);
        accelerometer = sensorManager.getDefaultSensor(Sensor.TYPE_LINEAR_ACCELERATION);
        rotation = sensorManager.getDefaultSensor(Sensor.TYPE_ROTATION_VECTOR);
        sensorManager.registerListener(this, accelerometer, SensorManager.SENSOR_DELAY_NORMAL);
        sensorManager.registerListener(this, rotation, SensorManager.SENSOR_DELAY_NORMAL);

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
                    /**
                     * function for whenever first location is found sucessfully.
                     * @param location - first location object.
                     */
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

        //when a location is recieved the code below is run.
        locationCallback = new LocationCallback() {
            /**
             * if a new location is received then the kalman filter update feature is run on the values until location result is null. Also the GPS poins from the filter are
             * plotted on the map as a green circle for the predicted values.
             * @param locationResult - latest location object.
             */
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
                    predictedLatLng = new LatLng(predicted.Latitude, predicted.Longitude);
                    CameraUpdate cameraUpdate = CameraUpdateFactory.newLatLng(predictedLatLng);
                    mMap.animateCamera(cameraUpdate);
                    addCircleToMap(predictedLatLng, Color.GREEN, 0.5);

                    JSONObject data = new JSONObject();
                    try {
                        // data.put("latitude", latitudeToMeters(predictedLatLng.latitude));
                        // data.put("longitude", longitudeToMeters(predictedLatLng.longitude));
                        data.put("latitude" ,   kalmanFilterLat.getPoint());
                        data.put("longitude" ,  kalmanFilterLon.getPoint());
                    } catch (JSONException e) {
                        // TODO Auto-generated catch block
                        e.printStackTrace();
                    }
                    socket.emit("mobile-channel" , data);

                }
            }
        };
        startLocationUpdates();
    }

    /**
     * function is called whenever a sensor change is detected. The kalamn filter is then run if it has been intialised already, and a roational matrix is created out of the values
     * of the sensors.
     * @param event - the Sensor event that has changed.
     */
    @Override
    public void onSensorChanged(SensorEvent event) {
        if (event.sensor.getType() == Sensor.TYPE_LINEAR_ACCELERATION) {
            System.arraycopy(event.values, 0, linearAcceleration, 0, event.values.length);
            if (rotationMatrixCreated) {
                android.opengl.Matrix.multiplyMV(absoluteAcceleration, 0, rotationMatrixInv, 0 , linearAcceleration, 0);

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

    /**
     * setup for the google maps to work on the application.
     * @param googleMap - GoogleMap object that is setup.
     */
    @Override
    public void onMapReady(GoogleMap googleMap) {
        mMap = googleMap;
    }

    /**
     * Adds circle to the map on the lat and long position passed in.
     * @param position - LatLong object that has the current latitude and longitude.
     * @param color - the hex colour that you want the circle to be.
     * @param size - the size of the circle on the map.
     */
    public void addCircleToMap(LatLng position, int color, double size) {
        CircleOptions circleOptions = new CircleOptions()
                .center(position)
                .fillColor(color)
                .strokeColor(Color.TRANSPARENT)
                .radius(size); //meters
        mMap.addCircle(circleOptions);
    }
}
