import cv2
import face_recognition
import sys

if __name__ == '__main__':
    cap = cv2.VideoCapture("testVideo.mp4")
    frame_number = 0

    if not cap.isOpened():
        print("Error: Video file not found or cannot be opened.")
        exit()


    while True:
       
        ret, frame = cap.read()

        if not ret:
            print("Video has ended.")
            break

        
        frame = cv2.resize(frame, (640, 480))

        
        rgb_frame = frame[:, :, ::-1]

        
        face_locations = face_recognition.face_locations(rgb_frame)

        for top, right, bottom, left in face_locations:
           
            face_image = frame[top:bottom, left:right]

            cv2.imwrite(f"face_image_{frame_number}.jpg", face_image)
            frame_number += 1

            cv2.rectangle(frame, (left, top), (right, bottom), (0, 0, 255), 2)

        # Display the resulting image
        cv2.imshow('Video', frame)

        # Wait for a short amount of time and check for user input to stop
        if cv2.waitKey(10) == 27:  # Press 'Esc' key to exit
            break

 
    cap.release()
    cv2.destroyAllWindows()
