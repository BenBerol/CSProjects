import tkinter as tk
import math
import path_points as pp

class Field:

    """
    A class representing the field the robot is previewed on

    Methods:
    - __init__(): Initializes the field
    - draw_grid(width, height): Draws a centered grid on the canvas with the 
    given width and height that fits within the canvas and has uniform tile size
    - set_robot(robot): Sets the robot to be drawn on the field
    - get_robot(): Returns the robot on the field
    - draw_robot(x, y, theta): Draws the robot on the field at the given x, y, and theta
    - draw_path(path): Draws the path on the field
    - clear_robot(): Removes the robot from the field
    - clear_lines(): Removes the path from the field
    - clear_canvas(): Removes all drawings from the canvas



    Parameters:
    - frame (tk.Frame): The frame to place the field in
    """

    def  __init__(self, frame):
        self.canvas = tk.Canvas(frame, width=750, height=750)
        self.canvas.pack(padx=100)
        self.size_factor = None
        self.robot = None
        self.robot_image = None
        self.robot_center = None
        self.x_offset = None
        self.y_offset = None
        self.lines = []
    
    def draw_grid(self, width, height):
        if width > height:
            self.size_factor = int(7 / width * 100)
        else:
            self.size_factor = int(7 / height * 100)
        grid_width = self.size_factor * width
        grid_height = self.size_factor * height

        self.x_offset = (700 - grid_width) // 2 + 10
        self.y_offset = (700 - grid_height) // 2 + 10

        self.canvas.create_line(self.x_offset, self.y_offset, self.x_offset + grid_width, self.y_offset, fill="black", tags="grid")
        self.canvas.create_line(self.x_offset, self.y_offset, self.x_offset, self.y_offset + grid_height, fill="black", tags="grid")
        for i in range(self.x_offset, self.x_offset + grid_width + 1, self.size_factor):
            self.canvas.create_line(i, self.y_offset, i, self.y_offset + grid_height, fill="black", tags="grid")
        for i in range(self.y_offset, self.y_offset + grid_height + 1, self.size_factor):
            self.canvas.create_line(self.x_offset, i, self.x_offset + grid_width, i, fill="black", tags="grid")

    def draw_robot(self, x, y, theta):
        self.clear_robot()

        x *= self.size_factor
        y *= self.size_factor

        robot_x = int(self.robot._robot_dimensions[0] * self.size_factor)
        robot_y = int(self.robot._robot_dimensions[1] * self.size_factor)

        corners = [
            (-robot_x / 2, -robot_y / 2),
            (robot_x / 2, -robot_y / 2),
            (robot_x / 2, robot_y / 2),
            (-robot_x / 2, robot_y / 2)
        ]

        theta_rad = theta * 3.141592653589793 / 180.0
        rotated_corners = []
        for corner in corners:
            rotated_x = corner[0] * math.cos(theta_rad) - corner[1] * math.sin(theta_rad)
            rotated_y = corner[0] * math.sin(theta_rad) + corner[1] * math.cos(theta_rad)
            rotated_corners.append((rotated_x + x + self.x_offset, rotated_y + y + self.y_offset))

        self.robot_image = self.canvas.create_polygon(rotated_corners, fill="blue", tags="robot")
        if (robot_x < robot_y): 
            self.robot_center = self.canvas.create_oval(
                x - robot_x / 6 + self.x_offset, y - robot_x / 6 + self.y_offset, 
                x + robot_x / 6 + self.x_offset, y + robot_x / 6 + self.y_offset, 
                fill="red", tags="robot_center")
        else:
            self.robot_center = self.canvas.create_oval(
                x - robot_y / 6 + self.x_offset, y - robot_y / 6 + self.y_offset, 
                x + robot_y / 6 + self.x_offset, y + robot_y / 6 + self.y_offset, 
                fill="red", tags="robot_center")
        
        print(f"Robot dimensions: {robot_x}, {robot_y}")

    def draw_path(self, path):
        if not path or len(path) <= 1:
            return
        
        self.clear_lines()

        scaled_path = [(point.get_x() * self.size_factor + self.x_offset, 
                        point.get_y() * self.size_factor + self.y_offset) 
                        for point in path]

        for i in range(len(scaled_path) - 1):
            line = self.canvas.create_line(
                    scaled_path[i][0], scaled_path[i][1], 
                    scaled_path[i + 1][0], scaled_path[i + 1][1], 
                    fill="black", width=3, tags="path")

            self.lines.append(line)

        self.canvas.tag_lower("robot")
        self.canvas.tag_lower("grid")
        self.canvas.tag_raise("path")
        self.canvas.tag_raise("robot_center")

    def clear_robot(self):
        if self.robot_image:
            self.canvas.delete(self.robot_image)
        if self.robot_center:
            self.canvas.delete(self.robot_center)
    
    def clear_lines(self):
        for line in self.lines:
            self.canvas.delete(line)
        self.lines = []

    def clear_canvas(self):
        self.canvas.delete("all")

    def set_robot(self, robot):
        self.robot = robot
        print(f"Robot set: {self.robot._robot_name}")

    def get_robot(self):
        return self.robot
