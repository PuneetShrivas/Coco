import cv2
import numpy as np
from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import HTMLResponse
from tempfile import NamedTemporaryFile

app = FastAPI()
# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Adjust this according to your requirements
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount static directory for serving HTML files

def detect_undertones(image):
    # Load the pre-trained face detector from OpenCV
    face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')
    
    # Convert the image to grayscale for face detection
    gray_image = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    
    # Detect faces in the image
    faces = face_cascade.detectMultiScale(gray_image, scaleFactor=1.1, minNeighbors=10, minSize=(30, 30))
    
    # If no face is detected, return 'Neutral'
    if len(faces) == 0:
        return 'Neutral'
    
    # Take the first detected face
    (x, y, w, h) = faces[0]
    
    # Draw a bounding box around the detected face
    cv2.rectangle(image, (x, y), (x + w, y + h), (0, 255, 0), 2)
    
    # Extract the face region
    face_region = image[y:y+h, x:x+w]
    
    # Convert the face region to the LAB color space
    lab_face_region = cv2.cvtColor(face_region, cv2.COLOR_BGR2LAB)
    
    # Calculate the average 'L', 'a', and 'b' values of the LAB face region
    avg_l_value = np.mean(lab_face_region[:, :, 0])
    avg_a_value = np.mean(lab_face_region[:, :, 1])
    avg_b_value = np.mean(lab_face_region[:, :, 2])
    
    # Calculate the normalized 'a', 'b', and 'L' values
    norm_a_value = avg_a_value / np.mean(lab_face_region)
    norm_b_value = avg_b_value / np.mean(lab_face_region)
    norm_l_value = avg_l_value / np.mean(lab_face_region)
    
    # Check if the absolute difference between average of 'a' and 'b' is less than 10.5
    if abs(avg_a_value - avg_b_value) < 10.5:
        skin_undertone = 'Neutral'
    else:
        # Check if b' - a' is less than 0.08 to determine undertone
        if norm_b_value - norm_a_value < 0.08:
            skin_undertone = 'Cool'
        else:
            skin_undertone = 'Warm'
    
    # # Write the normalized 'a', 'b', and 'L' values and the skin tone on the image
    # cv2.putText(image, f"Normalized 'a' Value: {norm_a_value:.2f}", (x, y - 50), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 255, 0), 2)
    # cv2.putText(image, f"Normalized 'b' Value: {norm_b_value:.2f}", (x, y - 30), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 255, 0), 2)
    # cv2.putText(image, f"Normalized 'L' Value: {norm_l_value:.2f}", (x, y - 10), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 255, 0), 2)
    # cv2.putText(image, f"Skin Undertone: {skin_undertone}", (x, y + h + 20), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 255, 0), 2)
    
    return skin_undertone

def detect_iris_color(image):
    # Load the pre-trained face and eye detectors from OpenCV
    face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')
    eye_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_eye.xml')
    
    # Convert the image to grayscale for face detection
    gray_image = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    
    # Detect faces in the image
    faces = face_cascade.detectMultiScale(gray_image, scaleFactor=1.1, minNeighbors=5, minSize=(30, 30))
    
    # If no face is detected, return None
    if len(faces) == 0:
        print("Error: Unable to detect face for iris color")
        return None
    
    # Take the first detected face
    (x_face, y_face, w_face, h_face) = faces[0]
    
    # Draw a bounding box around the detected face
    cv2.rectangle(image, (x_face, y_face), (x_face + w_face, y_face + h_face), (0, 255, 0), 2)
    
    # Convert the face region to grayscale for eye detection
    gray_face = gray_image[y_face:y_face+h_face, x_face:x_face+w_face]
    
    # Detect eyes in the face region
    eyes = eye_cascade.detectMultiScale(gray_face, scaleFactor=1.1, minNeighbors=5, minSize=(20, 20))
    
    # If less than two eyes are detected, return None
    if len(eyes) < 2:
        print("Error: Unable to detect both eyes.", len(eyes))
        return None
    
    # Initialize lists to store iris pixel colors and eye bounding box coordinates
    iris_colors = []
    eye_boxes = []
    
    # Loop through each detected eye region
    for (x_eye, y_eye, w_eye, h_eye) in eyes:
        # Convert eye coordinates to global image coordinates
        x_eye_global = x_face + x_eye
        y_eye_global = y_face + y_eye
        
        # Define the region of interest for the iris (assuming it occupies the center portion)
        iris_x = x_eye_global + w_eye//4
        iris_y = y_eye_global + h_eye//4
        iris_width = w_eye//2
        iris_height = h_eye//2
        
        # Extract the region of interest (ROI) corresponding to the iris
        iris_roi = image[iris_y:iris_y + iris_height, iris_x:iris_x + iris_width]
        
        # Convert the ROI to HSV color space
        hsv_roi = cv2.cvtColor(iris_roi, cv2.COLOR_BGR2HSV)
        
        # Define stricter color thresholds for blue, dark brown, light brown, gray, and green
        blue_lower = np.array([90, 50, 50])
        blue_upper = np.array([130, 255, 255])
        dark_brown_lower = np.array([10, 50, 50])
        dark_brown_upper = np.array([15, 255, 255])
        light_brown_lower = np.array([16, 50, 50])
        light_brown_upper = np.array([20, 255, 255])
        gray_lower = np.array([0, 0, 80])
        gray_upper = np.array([180, 30, 220])
        green_lower = np.array([30, 50, 50])
        green_upper = np.array([90, 255, 255])
        
        # Threshold the HSV image to extract blue, dark brown, light brown, gray, and green regions
        blue_mask = cv2.inRange(hsv_roi, blue_lower, blue_upper)
        dark_brown_mask = cv2.inRange(hsv_roi, dark_brown_lower, dark_brown_upper)
        light_brown_mask = cv2.inRange(hsv_roi, light_brown_lower, light_brown_upper)
        gray_mask = cv2.inRange(hsv_roi, gray_lower, gray_upper)
        green_mask = cv2.inRange(hsv_roi, green_lower, green_upper)
        
        # Count the number of non-zero pixels in each mask
        blue_count = cv2.countNonZero(blue_mask)
        dark_brown_count = cv2.countNonZero(dark_brown_mask)
        light_brown_count = cv2.countNonZero(light_brown_mask)
        gray_count = cv2.countNonZero(gray_mask)
        green_count = cv2.countNonZero(green_mask)
        
        # Classify the iris color based on the counts
        if blue_count > dark_brown_count and blue_count > light_brown_count and blue_count > gray_count and blue_count > green_count:
            iris_color = "blue"
        elif dark_brown_count > blue_count and dark_brown_count > light_brown_count and dark_brown_count > gray_count and dark_brown_count > green_count:
            iris_color = "dark brown"
        elif light_brown_count > blue_count and light_brown_count > dark_brown_count and light_brown_count > gray_count and light_brown_count > green_count:
            iris_color = "light brown"
        elif gray_count > blue_count and gray_count > dark_brown_count and gray_count > light_brown_count and gray_count > green_count:
            iris_color = "gray"
        elif green_count > blue_count and green_count > dark_brown_count and green_count > light_brown_count and green_count > gray_count:
            iris_color = "green"
        else:
            iris_color = "black"  # Default to black if none of the above conditions are met
        
        # Append the iris color to the list
        iris_colors.append(iris_color)
        
        # Store the eye bounding box coordinates
        eye_boxes.append((x_eye_global, y_eye_global, w_eye, h_eye))
    
    # # Draw bounding boxes around the detected eyes and label the iris color
    # for (x_eye, y_eye, w_eye, h_eye), iris_color in zip(eye_boxes, iris_colors):
    #     # Convert the iris color to tuple format for displaying
    #     iris_color_display = (0, 0, 255) if iris_color == "black" else (255, 255, 255)
        
    #     # Draw bounding box around the iris region
    #     cv2.rectangle(image, (iris_x, iris_y), (iris_x + iris_width, iris_y + iris_height), iris_color_display, 2)
        
    #     # Display the iris color label
    #     cv2.putText(image, f"Iris Color: {iris_color}", (x_eye, y_eye - 20), cv2.FONT_HERSHEY_SIMPLEX, 0.5, iris_color_display, 2)
    
    return iris_colors[0]

def detect_hair_color(image):
    # Convert image to HSV color space
    hsv_image = cv2.cvtColor(image, cv2.COLOR_BGR2HSV)

    # Load pre-trained face detection model
    face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')

    # Define predefined hair colors in BGR format
    hair_colors = {
        'black': np.array([0, 0, 0]),
        'brown_black': np.array([76, 85, 90]),  # Updated color definition for brown black
        'brown': np.array([50, 50, 50]),
        'blonde': np.array([255, 200, 150]),
        'gray': np.array([180, 180, 180]),
        'red': np.array([0, 0, 255])
    }

    # Detect faces
    faces = face_cascade.detectMultiScale(image, scaleFactor=1.1, minNeighbors=8, minSize=(30, 30))

    # Initialize variables for hair region bounding box
    hair_left = 0
    hair_top = 0
    hair_width = 0
    hair_height = 0

    # Define proportion of face width and height to use for hair region
    hair_width_ratio = 0.5
    hair_height_ratio = 0.25

    # Loop over detected faces
    for (x, y, w, h) in faces:
        # Calculate hair region bounding box
        hair_width = int(w * hair_width_ratio)
        hair_height = int(h * hair_height_ratio)
        hair_left = x + (w - hair_width) // 2
        hair_top = y - int(h * 0.25)  # Adjust the hair region vertically
        
        # Dilate and erode the hair region to clean up the mask
        hair_mask = np.zeros_like(hsv_image[:, :, 0], dtype=np.uint8)
        hair_mask[hair_top:hair_top + hair_height, hair_left:hair_left + hair_width] = 255
        hair_mask = cv2.dilate(hair_mask, None, iterations=2)
        hair_mask = cv2.erode(hair_mask, None, iterations=3)

        # Ensure that the mask has the same number of channels as the image
        hair_mask = cv2.merge([hair_mask] * 3)

        # Apply the hair mask to the HSV image to extract the hair region
        hair_region_hsv = cv2.bitwise_and(hsv_image, hair_mask)

        # Convert the hair region back to BGR color space
        hair_region = cv2.cvtColor(hair_region_hsv, cv2.COLOR_HSV2BGR)

        # # Display the hair region and hair mask for visualization
        # cv2.imshow('Dilated and Eroded Hair Region', hair_region)
        # cv2.waitKey(0)
        # cv2.destroyAllWindows()

        # Calculate the average color of the hair region
        average_color = cv2.mean(hair_region)[:3]

        # Assign the closest color category to the average color
        closest_color = None
        min_distance = float('inf')
        for color, color_value in hair_colors.items():
            distance = np.linalg.norm(average_color - color_value)
            if distance < min_distance:
                min_distance = distance
                closest_color = color
                return closest_color
    return None

def detect_skin_color(image):
    # Load the face cascade classifier
    face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')

    # Convert the image to grayscale
    gray_image = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    
    # Detect faces in the image
    faces = face_cascade.detectMultiScale(gray_image, scaleFactor=1.1, minNeighbors=5, minSize=(30, 30))
    
    if len(faces) == 0:
        return None  # No faces detected
    
    # Select the largest face as the region of interest (ROI)
    largest_face = max(faces, key=lambda face: face[2] * face[3])
    x, y, w, h = largest_face
    
    # Define a smaller portion of the face rectangle as the refined ROI
    roi_margin = 0.2  # Margin to leave around the face rectangle
    roi_x = int(x + roi_margin * w)
    roi_y = int(y + roi_margin * h)
    roi_w = int(w * (1 - 2 * roi_margin))
    roi_h = int(h * (1 - 2 * roi_margin))
    
    face_roi = image[roi_y:roi_y+roi_h, roi_x:roi_x+roi_w]
    
    # Calculate the average BGR color of the skin region
    average_bgr_color = np.mean(face_roi, axis=(0, 1))
    print(average_bgr_color)
    
    # Define color ranges for each category (in BGR format)
    color_ranges = {
        "Fair": (177, 204, 234),   # Light beige to pale pink
        "White": (205, 216, 228),  # Off-white to cream
        "Golden": (131, 180, 207), # Warm beige to honey
        "Brown": (73, 148, 123),   # Tan to cocoa
        "Beige": (137, 185, 186),  # Medium beige to taupe
        "Dark Brown": (53, 102, 90) # Deep brown to mahogany
    }
    
    # Calculate the closest color based on Euclidean distance
    closest_color = None
    min_distance = float('inf')
    for category, target_color in color_ranges.items():
        distance = np.linalg.norm(average_bgr_color - target_color)
        if distance < min_distance:
            min_distance = distance
            closest_color = category
    
    return closest_color

def define_season(undertone, iris_color, hair_color, skin_color):
    # Define the rules for each season based on undertone, iris color, and hair color
    seasons = {
    "Clear Spring": ("warm", {"blue", "green", "light_brown"}, {"blonde", "brown","brown_black"},{"fair","white","golden"}),#B
    "Warm Spring": ("warm", {"brown", "light_brown", "green",}, {"brown", "blonde", "red"},{"fair","golden","beige","brown"}),#B
    "Clear Winter": ("cool", {"blue", "green", "gray"}, {"black", "brown", "brown_black"},{"fair","white","golden","brown","beige","dark_brown"}),#B
    "Warm Autumn": ("warm", {"dark_brown", "light_brown", "green"}, {"brown", "brown_black", "red"},{"fair","white","golden","brown"}),#B
    "Deep Autumn": ("warm", {"blue", "green", "gray", "black"}, {"black", "brown_black", "brown", "red"},{"brown","beige","golden","dark_brown"}),#B
    "Soft Autumn": ("warm", {"light_brown", "green"}, {"blonde", "brown", "red"},{"fair","white","golden","brown"}), #B
    "Cool Winter": ("cool", {"blue", "gray", "light_brown"}, {"blonde", "gray, brown_black", "black"},{"fair","white","golden","brown","beige","dark_brown"}), #B
    "Soft Summer": ("neutral", {"light_brown", "gray", "blue"}, {"brown_black", "brown", "gray"},{"brown","beige","dark_brown"}),#B
    "Cool Summer": ("cool", {"dark_brown", "gray", "black"}, {"black", "brown_black", "brown"},{"brown","beige","dark_brown"}), #B
    "Light Summer": ("neutral", {"blue", "gray", "green"}, {"blonde", "gray"},{"fair","white","golden"}),#B
    "Light Spring": ("warm", {"blue", "green", "light_brown"}, {"blonde", "brown"},{"fair","white","golden"}),#B
    "Deep Winter": ("cool", {"dark_brown", "gray", "black"}, {"black", "brown_black"},{"fair","white","golden","brown","beige","dark_brown"}) #B
}
    
    season_final = None
    # Iterate over the seasons and check if the individual matches any of the rules
    for season, (season_undertone, season_iris_colors, season_hair_colors, skin_colors) in seasons.items():
        if undertone in (season_undertone, "neutral") and iris_color in season_iris_colors and hair_color in season_hair_colors and skin_color in skin_colors:
            print("your season could be: ", season)
            season_final = season    
    # If no matching season is found, return None
    return season_final

def process_image(image_path):
    image = cv2.imread(image_path)
    
    # Check if the image loading was successful
    if image is None:
        print("Error: Unable to load the image.")
        return None
    
    undertone = detect_undertones(image)
    print("Undertone: ",undertone)
    iris_color = detect_iris_color(image)
    print("Iris Color: ",iris_color)
    hair_color = detect_hair_color(image)
    print("Hair Color: ",hair_color)
    skin_color = detect_skin_color(image)
    print("Skin Color: ", skin_color)

    season = define_season(undertone.lower().replace(" ", "_"),iris_color.lower().replace(" ", "_"),hair_color.lower().replace(" ", "_"), skin_color.lower().replace(" ", "_"))
    return undertone, iris_color, hair_color, skin_color, season

# process_image('images/face_image2.jpg')

@app.post("/detect_season/")
async def detect_season(file: UploadFile = File(...)):
    # Save the uploaded file temporarily
    with NamedTemporaryFile(delete=False) as temp_image:
        temp_image.write(await file.read())
        temp_image_path = temp_image.name
    
    # Process the image and get the detected season
    undertone, iris_color, hair_color, skin_color, season = process_image(temp_image_path)
    
    # Delete the temporary file
    import os
    os.unlink(temp_image_path)
    
    return {
        "season": season, 
        "undertone": undertone,
        "iris_color": iris_color,
        "hair_color": hair_color,
        "skin_color": skin_color
            }

@app.post("/detect_season_with_selections/")
async def detect_season_with_selections(undertone: str, iris_color: str, hair_color: str, skin_color: str):
    # Call the define_season function with the selected values
    print("chosen undertone: ", undertone)
    print("chosen iris color: ", iris_color)
    print("chosen hair color: ", hair_color)
    print("chosen skin color: ", skin_color)
    
    season = define_season(undertone, iris_color, hair_color, skin_color)
    return {"season": season}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)