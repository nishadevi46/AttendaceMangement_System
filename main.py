import cv2
import face_recognition

# Open the video file
cap = cv2.VideoCapture("video.mp4")

# Check if the video file is loaded successfully
if not cap.isOpened():
    print("Error: Could not open the video file")
else:
    while True:
        # Read a single frame from the video
        ret, frame = cap.read()

        if not ret:
            # End of video or an error occurred
            break
        frame = cv2.resize(frame, (640, 480))
        # Convert the image color from BGR to RGB
        rgb_frame = frame[:, :, ::-1]

        # Locate coordinates of faces present in the frame
        face_locations = face_recognition.face_locations(rgb_frame)

        for top, right, bottom, left in face_locations:
            # Draw a rectangular box around the faces
            cv2.rectangle(frame, (left, top), (right, bottom), (0, 0, 255), 2)

        # Display the resulting image
        cv2.imshow('Video', frame)

        # Press 'q' to stop the video
        if cv2.waitKey(25) == 13:
            break
    # Release the video capture object and close the window
    cap.release()
    cv2.destroyAllWindows()
