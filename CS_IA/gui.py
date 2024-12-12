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
            family="Monaco", size=40, weight="bold", underline=1
        )
        self.body_font = font.Font(
            family="Monaco", size=25
        )
        self.button_font = font.Font(
            family="Monaco", size=20
        )

        self.robots = []

        # -----------------------------------------
        # Tab 1 Components

        tk.Label(
            self.tab1, text="Welcome Enter Robot Info Here:",
            font=self.title_font).pack(pady=20)

        # Robot info input boxes
        self.team_number = ib.InputBox(
            self.tab1, label="Enter your team number: ", font=self.body_font)
        self.robot_weight = ib.InputBox(
            self.tab1, label="Enter your robot weight (lbs): ",
            font=self.body_font)

        tk.Label(
            self.tab1, text="Wheel Locations (m from robot center)",
            font=self.title_font).pack()

        # Wheel location input boxes
        self.front_left = ib.InputBox(
            self.tab1, label="Front Left: ", font=self.body_font,
            numEntries=2, entryTexts=["Horizontal", "Vertical"])
        self.front_right = ib.InputBox(
            self.tab1, label="Front Right: ", font=self.body_font,
            numEntries=2, entryTexts=["Horizontal", "Vertical"])
        self.back_left = ib.InputBox(
            self.tab1, label="Back Left: ", font=self.body_font,
            numEntries=2, entryTexts=["Horizontal", "Vertical"])
        self.back_right = ib.InputBox(
            self.tab1, label="Back Right: ", font=self.body_font,
            numEntries=2, entryTexts=["Horizontal", "Vertical"])

        self.submit_button = tk.Button(
            self.tab1, text="Submit Info", command=self.submit_robot,
            font=self.button_font
        )
        self.submit_button.pack(pady=20)

        self.error_label = tk.Label(
            self.tab1, text="", font=self.body_font
        )
        self.error_label.pack()

        # -----------------------------------------
        # Tab 2 Components
        tk.Label(
            self.tab2, text="This is Tab 2").pack(pady=20)

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
            self.error_label.config(text="Please enter all field correctly")

    def exit_fullscreen(self, event=None):
        self.root.attributes("-fullscreen", False)
        time.sleep(1)
        self.root.geometry("1200x800")
