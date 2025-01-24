import tkinter as tk
from tkinter import ttk
from tkinter import font

import input_box as ib
import wheel as wh
import robot as rb
import field as fd
import path_points as pp
import wheel_data as wd
import json


class GUI:

    """
    A class representing the main GUI application using tkinter.

    Methods:
    - __init__(): Initializes the GUI application, creates the main window,
    and sets up the tabs.
    - submit_robot(): Adds a robot to the list of robots.
    - add_point(): Adds a point to the list of path points.
    - submit_boundaries(): Submits the boundaries for the field.
    - submit_points(): Submits the path points for the robot.
    - reset_points(): Resets the path points to the first point.
    """

    def __init__(self):
        # Makes the tkinter outline
        self.root = tk.Tk()
        self.root.title("My App")
        self.root.geometry("1200x800")
        self.window_width = self.root.winfo_screenwidth()
        self.window_height = self.root.winfo_screenheight()

        # Make the window full screen
        self.root.attributes("-fullscreen", True)

        # Create a Notebook widget
        self.notebook = ttk.Notebook(self.root)
        self.notebook.pack(expand=1, fill='both')

        # Create frames for each tab
        self.tab1 = tk.Frame(self.notebook)
        self.tab2 = tk.Frame(self.notebook)
        self.tab3 = tk.Frame(self.notebook)
        self.tab4 = tk.Frame(self.notebook)

        # Add tabs to the notebook
        self.notebook.add(self.tab1, text='Tab 1')
        self.notebook.add(self.tab2, text='Tab 2')
        self.notebook.add(self.tab3, text='Tab 3')
        self.notebook.add(self.tab4, text='Tab 4')

        # Create fonts
        self.title_font = font.Font(
            family="Monaco", size=40, weight="bold", underline=1)

        self.body_font = font.Font(
            family="Monaco", size=25)

        self.button_font = font.Font(
            family="Monaco", size=20)
        
        self.button_font2 = font.Font(
            family="Monaco", size=16)

        self.input_font = font.Font(    
            family="Monaco", size=16)

        self.robots = [rb.Robot(
            team_number=1418,
            robot_weight=100,
            robot_dimensions=(1.0, 1.0),
            robot_name="Default Robot",
            wheels=(
                wh.Wheel(0.5, -0.5),
                wh.Wheel(0.5, 0.5),
                wh.Wheel(-0.5, -0.5),
                wh.Wheel(-0.5, 0.5)
            )
        )]
        self.path_points_list = []
        self.boundary = []
        self.points_index = 1
        self.points = []


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
        self.robot_dimensions = ib.InputBox(
            self.tab1, label="Enter your robot dimensions (m): ",
            font=self.body_font, numEntries=2, entryTexts=["Width", "Height"],
            input_side=tk.LEFT)
        self.robot_name = ib.InputBox(
            self.tab1, label="Enter your robot name: ",
            font=self.body_font, input_side=tk.LEFT)

        tk.Label(
            self.tab1, text="Wheel Locations (m from robot center)",
            font=self.title_font).pack()

        # Wheel location input boxes
        self.front_left = ib.InputBox(
            self.tab1, label="Front Left: ", font=self.body_font,
            numEntries=2, entryTexts=["Forward", "Lateral"], input_side=tk.LEFT)
        self.front_right = ib.InputBox(
            self.tab1, label="Front Right: ", font=self.body_font,
            numEntries=2, entryTexts=["Forward", "Lateral"], input_side=tk.LEFT)
        self.back_left = ib.InputBox(
            self.tab1, label="Back Left: ", font=self.body_font,
            numEntries=2, entryTexts=["Forward", "Lateral"], input_side=tk.LEFT)
        self.back_right = ib.InputBox(
            self.tab1, label="Back Right: ", font=self.body_font,
            numEntries=2, entryTexts=["Forward", "Lateral"], input_side=tk.LEFT)

        # Button to submit robot info
        self.submit_button = tk.Button(
            self.tab1, text="Submit Info", command=self.submit_robot,
            font=self.button_font)

        self.submit_button.pack(pady=20)

        self.error_label = tk.Label(
            self.tab1, text="", font=self.body_font)
        
        self.choose_robot = tk.Label(
            self.tab1, text="Choose a robot to design a path for:",
            font=self.title_font)
        self.choose_robot.pack(pady=20)

        # Dropdown menu to select a robot
        self.robot_var = tk.StringVar()
        self.robot_var.set("Select a robot")
        self.robot_dropdown = ttk.Combobox(
            self.tab1, textvariable=self.robot_var, font=self.body_font, state="readonly")
        self.robot_dropdown['values'] = [robot._robot_name for robot in self.robots]
        self.robot_dropdown.pack(pady=20)

        self.error_label.pack()

        # -----------------------------------------
        # Tab 2 Components

        self.title_frame = tk.Frame(self.tab2)
        self.title_frame.pack(side=tk.TOP)

        self.previewButton = tk.Button(
            self.title_frame, text="Run Preview", font=self.button_font,
            command=self.run_preview
        )
        self.previewButton.pack(pady=20, side=tk.RIGHT, padx=30)

        tk.Label(
            self.title_frame, text="Design Robot Path",
            font=self.title_font).pack(pady=20, side=tk.RIGHT)
        
        self.speed_slider = tk.Scale(
                self.title_frame, from_=1, to=20, orient=tk.HORIZONTAL,
                label="Time To Complete Path (s)", font=self.button_font, length=350,
                resolution=0.5)
        self.speed_slider.pack(pady=20, side=tk.RIGHT, padx=20)

        self.path_points = tk.Frame(self.tab2, width=float(self.window_width)/3-1, height=800)
        self.path_points.pack(side=tk.LEFT, fill=tk.Y)

        self.boundaries = ib.InputBox(
            self.path_points, label="Rounded boundaries (m): ", font=self.input_font, 
            numEntries=2, entryTexts=["Width", "Height"], input_side=tk.LEFT, frame_side=tk.TOP)

        self.submit_boundaries_button = tk.Button(
            self.path_points, text="Submit Boundaries", font=self.button_font2,
            command=self.submit_boundaries)
        self.submit_boundaries_button.pack(side=tk.TOP, pady=5)
        
        point1 = ib.PointBox(
            self.path_points, point_number="1", font=self.input_font, visible=True)
        self.path_points_list.append(point1)

        for i in range(2, 16):
            point = ib.PointBox(
                self.path_points, point_number=i, font=self.input_font, visible=False)
            self.path_points_list.append(point)

        self.reset_points_button = tk.Button(
            self.path_points, text="Reset Points", font=self.button_font2,
            command=self.reset_points)
        self.reset_points_button.pack(side=tk.BOTTOM, pady=5)

        self.submit_point_button = tk.Button(
            self.path_points, text="Submit Path", font=self.button_font2,
            command=self.submit_points)
        self.submit_point_button.pack(side=tk.BOTTOM, pady=5)

        self.add_point_button = tk.Button(
            self.path_points, text="Add Point", font=self.button_font2,
            command=self.add_point)
        self.add_point_button.pack(side=tk.BOTTOM, pady=5)

        self.error_label1 = tk.Label(
            self.path_points, text="", font=self.button_font2)
        self.error_label1.pack(side=tk.BOTTOM, pady=5)

        # Create a frame for the boundary line
        boundary_frame = tk.Frame(self.tab2, width=2, bg="black")
        boundary_frame.pack(side=tk.LEFT, fill=tk.Y)

        # Widgets for the preview page on the right side of the tab
        self.preview_page = tk.Frame(self.tab2, width=float(self.window_width)*2/3-1, height=800)
        self.preview_page.pack(side=tk.LEFT)

        self.field = fd.Field(self.preview_page)

        # -----------------------------------------
        # Tab 3 Components

        tk.Label(
            self.tab3, text="Wheel Data",
            font=self.title_font).pack(pady=20)

        self.table_frame = tk.Frame(self.tab3)
        self.table_frame.pack(fill=tk.BOTH, expand=True)

        self.tree = ttk.Treeview(self.table_frame, columns=("Column1", "Column2", "Column3"), show='headings')
        style = ttk.Style()
        style.configure("Treeview.Heading", font=("Monaco", 25)) 
        style.configure("Treeview", font=("Monaco", 20), padding=10, rowheight=40)

        self.tree.heading("Column1", text="Time (seconds)")
        self.tree.heading("Column2", text="Angle (Degrees)")
        self.tree.heading("Column3", text="Wheel Speed (m/s)")
        self.tree.pack(fill=tk.BOTH, expand=True)

        self.input_frame = tk.Frame(self.tab3)
        self.input_frame.pack(side=tk.TOP, pady=20)

        self.populate_button = tk.Button(self.input_frame, text="Populate Table", command=self.populate_table, font=self.button_font)
        self.populate_button.pack(side=tk.LEFT, padx=10)

        self.wheel_var = tk.StringVar()
        self.wheel_var.set("Select a wheel")
        self.wheel_dropdown = ttk.Combobox(
            self.input_frame, textvariable=self.wheel_var, font=self.button_font, state="readonly")
        self.wheel_dropdown['values'] = ["Front Left", "Front Right", "Back Left", "Back Right"]
        self.wheel_dropdown.pack(side=tk.LEFT, padx=10)

        self.error_label2 = tk.Label(
            self.input_frame, text="", font=self.button_font)
        self.error_label2.pack(side=tk.RIGHT, padx=10)

        self.button_frame = tk.Frame(self.tab3)
        self.button_frame.pack(side=tk.BOTTOM, pady=20)

        self.export_button = tk.Button(self.button_frame, text="Export Wheel Data", command=self.export_wheel_data, font=self.button_font)
        self.export_button.pack(side=tk.LEFT, padx=10)

        self.sort_var = tk.StringVar()
        self.sort_var.set("Sort by what?")
        self.sort_dropdown = ttk.Combobox(
            self.button_frame, textvariable=self.sort_var, font=self.button_font, state="readonly")
        self.sort_dropdown['values'] = ["Time", "Angle", "Wheel Speed"]
        self.sort_dropdown.pack(side=tk.LEFT, padx=10)

        self.sort_data_button = tk.Button(self.button_frame, text="Sort Data", command=self.sort_data, font=self.button_font)
        self.sort_data_button.pack(side=tk.LEFT, padx=10)

        # -----------------------------------------
        # Tab 4 Components

        tk.Label(
            self.tab4, text="Path Data",
            font=self.title_font).pack(pady=20)

        self.table_frame1 = tk.Frame(self.tab4)
        self.table_frame1.pack(fill=tk.BOTH, expand=True)

        self.tree1 = ttk.Treeview(self.table_frame1, columns=("Column1", "Column2", "Column3"), show='headings')
        style = ttk.Style()
        style.configure("Treeview.Heading", font=("Monaco", 25)) 
        style.configure("Treeview", font=("Monaco", 20), padding=10, rowheight=40)

        self.tree1.heading("Column1", text="Horizontal (m)")
        self.tree1.heading("Column2", text="Vertical (m)")
        self.tree1.heading("Column3", text="Angle (Degrees)")
        self.tree1.pack(fill=tk.BOTH, expand=True)

        self.input_frame1 = tk.Frame(self.tab4)
        self.input_frame1.pack(side=tk.TOP, pady=20)

        self.populate_button1 = tk.Button(self.input_frame1, text="Populate Table", command=self.populate_path, font=self.button_font)
        self.populate_button1.pack(side=tk.LEFT)

        self.error_label3 = tk.Label(
            self.input_frame1, text="", font=self.button_font)
        self.error_label3.pack(side=tk.RIGHT)

        self.button_frame1 = tk.Frame(self.tab4)
        self.button_frame1.pack(side=tk.BOTTOM, pady=20)

        self.export_button1 = tk.Button(self.button_frame1, text="Export Path Data", command=self.export_path_data, font=self.button_font)
        self.export_button1.pack(side=tk.LEFT)

        self.import_button = tk.Button(self.button_frame1, text="Import Path Data", command=self.import_path_data, font=self.button_font)
        self.import_button.pack(side=tk.LEFT)

        self.root.mainloop()
        print("GUI initialized")

    def sort_data(self):
        try:
            if self.robot_dropdown.get() == "Select a robot":
                self.error_label2.config(text="Please select a robot")
                return

            robot = self.robots[self.robot_dropdown.current()]

            if robot._wheels[0].data == []:
                self.error_label2.config(text="No data to sort")
                return

            if self.sort_var.get() == "Sort by what?":
                self.error_label2.config(text="Please select a sort option")
                return

            wheel_index = self.wheel_dropdown.current()
            sort_option = self.sort_var.get()

            unsorted_data = []
            index = 0
            if (sort_option == "Time"):
                for data in robot._wheels[wheel_index].data:
                    unsorted_data.append([data._timestamp, index])
                    index += 1
            if (sort_option == "Angle"):
                for data in robot._wheels[wheel_index].data:
                    unsorted_data.append([data._angle, index])
                    index += 1
            if (sort_option == "Wheel Speed"):
                for data in robot._wheels[wheel_index].data:
                    unsorted_data.append([data._speed, index])
                    index += 1
            
            for i in range(1, len(unsorted_data)):
                key = unsorted_data[i]

                j = i-1
                while j >= 0 and key[0] < unsorted_data[j][0]:
                    unsorted_data[j + 1] = unsorted_data[j]
                    j -= 1
                
                unsorted_data[j + 1] = key
            
            sorted_data = unsorted_data

            for row in self.tree.get_children():
                self.tree.delete(row)

            for data in sorted_data:
                print(data)
                data_index = data[1]
                wheel_data = robot._wheels[wheel_index].data[data_index]
                self.tree.insert("", "end", values=(wheel_data._timestamp, wheel_data._angle, wheel_data._speed))
            
            self.error_label2.config(text="Data sorted successfully")
        
        except Exception as e:
            self.error_label3.config(text="Error sorting data")
            print("Error: " + str(e))

    def import_path_data(self):
        try:
            self.reset_points()
            with open("path_data.json", "r") as json_file:
                data = json.load(json_file)
                self.points = []
                for point in data:
                    self.points.append(pp.PathPoint(point["x"], point["y"], point["angle"]))
                self.points_index = 0
                for point in self.points:
                    if not self.path_points_list[self.points_index].visible:
                        self.path_points_list[self.points_index].make_visible()
                    self.path_points_list[self.points_index].set_text(point.get_x(), 0)
                    self.path_points_list[self.points_index].set_text(point.get_y(), 1)
                    self.path_points_list[self.points_index].set_text(point.get_angle(), 2)
                    self.points_index += 1
                self.populate_path()


        except Exception as e:
            self.error_label3.config(text="Error importing data")
            print("Error: " + str(e))

    def populate_path(self):
        self.submit_points("")

        for row in self.tree1.get_children():
            self.tree1.delete(row)

        for point in self.points:
            self.tree1.insert("", "end", values=(point.get_x(), point.get_y(), point.get_angle()))

    def export_path_data(self):
        try:
            if (len(self.points) == 0):
                self.error_label3.config(text="No data to export")
                return
            
            path_data = []
            for point in self.points:
                path_data.append({
                    "x": point.get_x(),
                    "y": point.get_y(),
                    "angle": point.get_angle()
                })
            
            with open("path_data.json", "w") as json_file:
                json.dump(path_data, json_file, indent=4)

        except Exception as e:
            print("Error: " + str(e))   
            self.error_label3.config(text="Error exporting data")

    def export_wheel_data(self):
        try:
            if self.robot_dropdown.get() == "Select a robot":
                self.error_label2.config(text="Please select a robot")
                return
            
            robot = self.robots[self.robot_dropdown.current()]

            if robot._wheels[0].data == []:
                self.error_label2.config(text="No data to export")
                return

            robot_data = []
            wheel_index = 0
            for wheel in robot._wheels:
                wheel_data_list = []
                for wheel_data in wheel.data:
                    wheel_data_list.append({
                        "timestamp": wheel_data._timestamp,
                        "angle": wheel_data._angle,
                        "speed": wheel_data._speed
                    })
                robot_data.append({
                    f"Wheel {wheel_index+1}": wheel_data_list
                    })
                wheel_index += 1

            with open("wheel_data.json", "w") as json_file:
                json.dump(robot_data, json_file, indent=4)

            self.error_label2.config(text="Data exported successfully")

        except Exception as e:
            self.error_label2.config(text="Error exporting data")
            print("Error: " + str(e))

    def populate_table(self, data = None):
        try:
            if (self.robot_dropdown.get() == "Select a robot"):
                self.error_label2.config(text="Please select a robot")
                return

            robot = self.robots[self.robot_dropdown.current()]

            visible_points = 0
            for input in self.path_points_list:
                if (input.visible):
                    visible_points += 1
            if (visible_points < 2):
                self.error_label1.config(text="Please enter 2 or more points")
                return

            if (self.wheel_dropdown.get() == "Select a wheel"):
                self.error_label2.config(text="Please select a wheel")
                return
            else:
                selected_wheel = self.wheel_dropdown.current()
                self.error_label2.config(text="")

            robot.compute_data(self.points, self.speed_slider.get())

            for row in self.tree.get_children():
                self.tree.delete(row)

            for wheel_data in robot._wheels[selected_wheel].data:
                self.tree.insert("", "end", values=(wheel_data._timestamp, wheel_data._angle, wheel_data._speed))

        except Exception as e:
            self.error_label2.config(text="Error populating table")
            print("Error: " + str(e))

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
                robot_dimensions=self.robot_dimensions.get_all_float(),
                robot_name=self.robot_name.get_text(),
                wheels=wheels)

            self.robots.append(robot)
            self.team_number.clear_text()
            self.robot_weight.clear_text()
            self.robot_dimensions.clear_all_text()
            self.robot_name.clear_text()
            self.front_left.clear_all_text()
            self.front_right.clear_all_text()
            self.back_left.clear_all_text()
            self.back_right.clear_all_text()

            self.robot_dropdown['values'] = [robot._robot_name for robot in self.robots]


        except Exception as e:
            print("Error: " + str(e))
            self.error_label.config(text="Please enter all fields correctly")

    def add_point(self):
        try:
            self.path_points_list[self.points_index].make_visible()
            self.points_index += 1
        except Exception as e:
            print("Error: " + str(e))
            self.error_label1.config(text="No more points can be added")

    def submit_boundaries(self):
        try:
            self.error_label1.config(text="")
            self.boundary = self.boundaries.get_all_float()
            self.field.clear_canvas()
            self.field.draw_grid(int(self.boundary[0]), int(self.boundary[1]))
    
        except Exception as e:
            print("Error: " + str(e))
            self.error_label1.config(text="Please enter all fields correctly")
        
        if (self.robot_dropdown.get() != "Select a robot"):
            self.submit_points("")

    def submit_points(self, errorMessage = "Please enter all fields correctly"):
        try:
            if (self.robot_dropdown.get() == "Select a robot"):
                self.error_label1.config(text="Please select a robot")
                return
            if (self.boundary == []):
                self.error_label1.config(text="Please enter boundaries")
                return
            self.field.set_robot(self.robots[self.robot_dropdown.current()])

            self.points = []
            for point in self.path_points_list:
                if (point.visible):
                    self.points.append(pp.PathPoint(point.get_float(0), point.get_float(1), point.get_float(2)))

            self.field.draw_robot(self.points[0].get_x(), self.points[0].get_y(), self.points[0].get_angle(), False)
            self.field.draw_path(self.points)

            self.error_label1.config(text="")

        except Exception as e:
            print("Error: " + str(e))
            self.error_label1.config(text=errorMessage)
    
    def reset_points(self):
        try:
            self.error_label1.config(text="")
            for point in self.path_points_list:
                if (point.visible):
                    point.clear_text(0)
                    point.clear_text(1)
                    point.clear_text(2)
                    point.make_invisible()
            self.path_points_list[0].make_visible()

            self.points_index = 1

            self.field.clear_robot()
            self.field.clear_lines()
            self.field.clear_previews()
        except Exception as e:
            print("Error: " + str(e))
            self.error_label1.config(text="Error resetting")
   
    def run_preview(self):
        try:
            self.field.run_preview(self.speed_slider.get())
        except Exception as e:
            print("Error: " + str(e))
            self.error_label1.config(text="Error running preview")
