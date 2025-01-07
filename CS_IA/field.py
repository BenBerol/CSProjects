import tkinter as tk

class Field:

    """
    A class representing the field the robot is previewed on

    Methods:
    - __init__(): Initializes the field
    - clear_canvas(): Removes all drawings from the canvas
    - draw_grid(width, height): Draws a centered grid on the canvas with the 
    given width and height that fits within the canvas and has uniform tile size
    - set_robot(robot): Sets the robot to be drawn on the field


    Parameters:
    - frame (tk.Frame): The frame to place the field in
    """

    def  __init__(self, frame):
        self.canvas = tk.Canvas(frame, width=750, height=750)
        self.canvas.pack(padx=100)
    
    def clear_canvas(self):
        self.canvas.delete("all")
    
    def draw_grid(self, width, height):
        if width > height:
            self.size_factor = 7 / width * 100
        else:
            self.size_factor = 7 / height * 100
        increment = int(self.size_factor)
        grid_width = increment * width
        grid_height = increment * height

        x_offset = (700 - grid_width) // 2 + 10
        y_offset = (700 - grid_height) // 2 + 10

        self.canvas.create_line(x_offset, y_offset, x_offset + grid_width, y_offset, fill="black")
        self.canvas.create_line(x_offset, y_offset, x_offset, y_offset + grid_height, fill="black")
        for i in range(x_offset, x_offset + grid_width + 1, increment):
            self.canvas.create_line(i, y_offset, i, y_offset + grid_height, fill="black")
        for i in range(y_offset, y_offset + grid_height + 1, increment):
            self.canvas.create_line(x_offset, i, x_offset + grid_width, i, fill="black")
    
    def set_robot(self, robot):
        self.robot = robot
        print(f"Robot set: {self.robot._robot_name}")
