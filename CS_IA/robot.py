import wheel as wh
import math
import numpy as np

class Robot():

    """
    A read only class that represents a robot.

    Parameters:
    - team_number (int): The team number of the robot.
    - robot_weight (float): The weight of the robot.
    - robot_dimensions (list): The dimensions of the robot.
    - robot_name (str): The name of the robot.
    - wheels (tuple of wheel objects): An immutable list of
    wheel objects in the robot

    Methods:
    - compute_data(path_points: list, time: float): Computes the data for the wheels
    using the path points and time.
    - get_team_number(): Returns the team number of the robot.
    - get_robot_weight(): Returns the weight of the robot.
    - get_wheels(): Returns the list of wheel locations in the robot.
    - __setattr__(name, value): Raises an AttributeError if
    an attribute is modified.
    """

    def __init__(self, team_number: int, robot_weight: int, robot_dimensions: list, robot_name: str, wheels: list[wh.Wheel]):

        self._team_number = team_number
        self._robot_weight = robot_weight
        self._robot_dimensions = robot_dimensions
        self._robot_name = robot_name
        self._wheels = wheels

    def compute_data(self, path_points: list, time: float):
        for wheel in self._wheels:
            wheel.data = []
        path_length = 0
        segment_lengths = []
        for i in range(len(path_points)-1):
            segment_lengths.append(math.sqrt((path_points[i+1].get_x()-path_points[i].get_x())**2+(path_points[i+1].get_y()-path_points[i].get_y())**2))
            path_length += segment_lengths[i]
        for i in range(len(path_points)-1):
            delta_x = path_points[i+1].get_x()-path_points[i].get_x()
            delta_y = path_points[i+1].get_y()-path_points[i].get_y()
            delta_theta = path_points[i+1].get_angle()-path_points[i].get_angle()
            delta_theta = np.radians(delta_theta)
            time_segment = segment_lengths[i]/path_length*time
            x_vel = delta_x/time_segment
            y_vel = delta_y/time_segment
            angular_vel = delta_theta/time_segment
            for wheel in self._wheels:
                wheel.calculate_data(np.array([x_vel, y_vel]), angular_vel, time_segment)

    @property
    def get_team_number(self):
        return self._team_number

    @property
    def get_robot_weight(self):
        return self._robot_weight

    @property
    def get_robot_dimensions(self):
        return self._robot_dimensions

    @property
    def get_robot_name(self):
        return self._robot_name

    @property
    def get_wheels(self):
        return self._wheels

    def __setattr__(self, name, value):
        if hasattr(self, name):
            raise AttributeError(f"Cannot modify attribute '{name}'")
        super().__setattr__(name, value)
