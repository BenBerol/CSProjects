import math


class PathPoint:
    """
    A class representing the path points the robot will follow

    Methods:
    - __init__(): Initializes the path point
    - compute_angle(): Computes the angle of the path point relative to the grid
    - set_x(x): Sets the horizontal location of the path
    - set_y(y): Sets the vertical location of the path
    - set_angle(angle): Sets the angle of the path
    - get_x(): Returns the horizontal location of the path
    - get_y(): Returns the vertical location of the path
    - get_angle(): Returns the angle of the path

    Parameters:
    - x (float): The horizontal location of the path
    - y (float): The vertical location of the path
    - angle (float): The angle of the path
    """

    def __init__(self, x, y, angle):
        self.x = x
        self.y = y
        self.angle = angle

    def compute_angle(self):
        return math.degrees(math.atan2(self.y, self.x))

    def set_x(self, x):
        self.x = x

    def set_y(self, y):
        self.y = y

    def set_angle(self, angle):
        self.angle = angle

    def get_x(self):
        return self.x

    def get_y(self):
        return self.y

    def get_angle(self):
        return self.angle
