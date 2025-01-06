import tkinter as tk
from tkinter import ttk
from tkinter import font
import time

import input_box as ib
import wheel as wh
import robot as rb


class GUI:

    """
    A class representing the main GUI application using tkinter.

    Methods:
    - __init__(): Initializes the GUI application, creates the main window,
    and sets up the tabs.
    - exit_fullscreen(): Exits full screen mode.
    - submit_robot(): Adds a robot to the list of robots.
    """

    def __init__(self):
        # Makes the tkinter outline
        self.root = tk.Tk()
        self.root.title("My App")
        self.root.geometry("1200x800")
        self.window_width = self.root.winfo_screenwidth()

        # Make the window full screen
        self.root.attributes("-fullscreen", True)
        self.root.bind("<Escape>", self.exit_fullscreen)

        # Create a Notebook widget
        self.notebook = ttk.Notebook(self.root)
        self.notebook.pack(expand=1, fill='both')

        # Create frames for each tab
        self.tab1 = tk.Frame(self.notebook)
        self.tab2 = tk.Frame(self.notebook)
        self.tab3 = tk.Frame(self.notebook)

        # Add tabs to the notebook
        self.notebook.add(self.tab1, text='Tab 1')
        self.notebook.add(self.tab2, text='Tab 2')
        self.notebook.add(self.tab3, text='Tab 3')

        # Create fonts
        self.title_font = font.Font(
            family="Monaco", size=40, weight="bold", underline=1)

        self.body_font = font.Font(
            family="Monaco", size=25)

        self.button_font = font.Font(
            family="Monaco", size=20)

        self.input_font = font.Font(    
            family="Monaco", size=16)

        self.robots = []
        self.points = 1
        self.path_points_list = []

        # -----------------------------------------
        # Tab 1 Components

        tk.Label(
            self.tab1, text="Welcome Enter Robot Info Here:",
            font=self.title_font).pack(pady=20)

        # Robot info input boxes
        self.team_number = ib.InputBox(
            self.tab1, label="Enter your team number: ", 
            font=self.body_font, input_side=tk.LEFT)
        self.robot_weight = ib.InputBox(
            self.tab1, label="Enter your robot weight (lbs): ",
            font=self.body_font, input_side=tk.LEFT)

        tk.Label(
            self.tab1, text="Wheel Locations (m from robot center)",
            font=self.title_font).pack()

        # Wheel location input boxes
        self.front_left = ib.InputBox(
            self.tab1, label="Front Left: ", font=self.body_font,
            numEntries=2, entryTexts=["Horizontal", "Vertical"], input_side=tk.LEFT)
        self.front_right = ib.InputBox(
            self.tab1, label="Front Right: ", font=self.body_font,
            numEntries=2, entryTexts=["Horizontal", "Vertical"], input_side=tk.LEFT)
        self.back_left = ib.InputBox(
            self.tab1, label="Back Left: ", font=self.body_font,
            numEntries=2, entryTexts=["Horizontal", "Vertical"], input_side=tk.LEFT)
        self.back_right = ib.InputBox(
            self.tab1, label="Back Right: ", font=self.body_font,
            numEntries=2, entryTexts=["Horizontal", "Vertical"], input_side=tk.LEFT)

        self.submit_button = tk.Button(
            self.tab1, text="Submit Info", command=self.submit_robot,
            font=self.button_font)

        self.submit_button.pack(pady=20)

        self.error_label = tk.Label(
            self.tab1, text="", font=self.body_font)

        self.error_label.pack()

        # -----------------------------------------
        # Tab 2 Components
        tk.Label(
            self.tab2, text="Design Robot Path",
            font=self.title_font).pack(pady=20)

        self.path_points = tk.Frame(self.tab2, width=float(self.window_width)/3-1, height=800)
        self.path_points.pack(side=tk.LEFT, fill=tk.Y)

        self.boundaries = ib.InputBox(
            self.path_points, label="Field Boundaries (m): ", font=self.input_font, 
            numEntries=2, entryTexts=["Width", "Height"], input_side=tk.LEFT, frame_side=tk.TOP)
        
        point1 = ib.PointBox(
            self.path_points, point_number="1", font=self.input_font, visible=True)
        self.path_points_list.append(point1)

        for i in range(2, 16):
            point = ib.PointBox(
                self.path_points, point_number=i, font=self.input_font, visible=False)
            self.path_points_list.append(point)

        self.reset_points_button = tk.Button(
            self.path_points, text="Reset Points", font=self.button_font,
            command=self.reset_points)
        self.reset_points_button.pack(side=tk.BOTTOM, pady=5)

        self.submit_point_button = tk.Button(
            self.path_points, text="Submit Path", font=self.button_font,
            command=self.submit_points)
        self.submit_point_button.pack(side=tk.BOTTOM, pady=5)

        self.add_point_button = tk.Button(
            self.path_points, text="Add Point", font=self.button_font,
            command=self.add_point)
        self.add_point_button.pack(side=tk.BOTTOM, pady=5)

        self.error_label1 = tk.Label(
            self.path_points, text="", font=self.button_font)

        self.error_label1.pack(side=tk.BOTTOM, pady=5)

        # Create a frame for the boundary line
        boundary_frame = tk.Frame(self.tab2, width=2, bg="black")
        boundary_frame.pack(side=tk.LEFT, fill=tk.Y)

        self.preview_page = tk.Frame(self.tab2, width=float(self.window_width)*2/3-1, height=800)
        self.preview_page.pack(side=tk.LEFT)


        self.path_points = tk.Frame(self.tab2, width=1198, height=800)

        self.root.mainloop()
        print("GUI initialized")

    def submit_robot(self):
        try:
            self.error_label.config(text="")

            # Initialize the wheels with the wheel locations
            wheels = (
                    wh.Wheel(self.front_left.get_float(0),
                             self.front_left.get_float(1)),
                    wh.Wheel(self.front_right.get_float(0),
                             self.front_right.get_float(1)),
                    wh.Wheel(self.back_left.get_float(0),
                             self.back_left.get_float(1)),
                    wh.Wheel(self.back_right.get_float(0),
                             self.back_right.get_float(1)))

            # Initialize the robot with the robot info and wheels
            robot = rb.Robot(
                team_number=int(self.team_number.get_text()),
                robot_weight=float(self.robot_weight.get_text()),
                wheels=wheels)

            self.robots.append(robot)
            print("Robot added")

        except Exception as e:
            print("Error: " + str(e))
            self.error_label.config(text="Please enter all fields correctly")

    def add_point(self):
        try:
            self.path_points_list[self.points].make_visible()
            self.points += 1
            print("Point added")
        except Exception as e:
            print("Error: " + str(e))
            self.error_label1.config(text="No more points can be added")

    def submit_points(self):
        try:
            self.error_label1.config(text="")
            boundary = self.boundaries.get_all_float()
            points = []
            for point in self.path_points_list:
                if (point.visible):
                    points.append(point.get_all_float())
            print("Points submitted")
            for float in boundary:
                print(float)
            for point in points:
                print(point)

        except Exception as e:
            print("Error: " + str(e))
            self.error_label1.config(text="Please enter all fields correctly")
    
    def reset_points(self):
        try:
            self.error_label1.config(text="")
            for point in self.path_points_list:
                if (point.visible and point.point_number != "1"):
                    point.clear_text(0)
                    point.clear_text(1)
                    point.make_invisible()
            self.points = 1
            print("Points reset")
        except Exception as e:
            print("Error: " + str(e))
            self.error_label1.config(text="Error resetting")

    def exit_fullscreen(self, event=None):
        self.root.attributes("-fullscreen", False)
        time.sleep(1)
        self.root.geometry("1200x800")
