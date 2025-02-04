import wheel_data as wd
import numpy as np


class Wheel:
    """
    A read only class that represents a wheel.

    Parameters:
    - x_pos (float): The x position of the wheel.
    - y_pos (float): The y position of the wheel.

    Methods:
    - calculate_data(rb_translational_vel=np.array, rb_angular_vel=float, time=float):
    Calculates the wheel data using robot input data.
    - getx_pos(): Returns the x position of the wheel.
    - gety_pos(): Returns the y position of the wheel.
    - get_pos(): Returns the position of the wheel as a tuple.
    - __setattr__(name, value): Raises an AttributeError if
    """

    def __init__(self, x_pos: float, y_pos: float):
        self._x_pos = x_pos
        self._y_pos = y_pos
        self._pos_vector = np.array([self._x_pos, self._y_pos])
        self.data = []

    def calculate_data(
        self, rb_translational_vel=np.array, rb_angular_vel=float, time=float
    ):
        wheel_translation_vel = rb_translational_vel
        angular_vector = np.array([-self._y_pos, self._x_pos])
        wheel_angular_vel = rb_angular_vel * angular_vector
        wheel_vel = wheel_translation_vel + wheel_angular_vel
        wheel_angle = np.degrees(np.arctan2(-wheel_vel[1], wheel_vel[0]))
        wheel_speed = np.linalg.norm(wheel_vel)
        if wheel_angle < 0:
            wheel_angle += 360
        wheel_data = wd.wheel_data(time, wheel_angle, wheel_speed)
        self.data.append(wheel_data)

    @property
    def getx_pos(self):
        return self._x_pos

    @property
    def gety_pos(self):
        return self._y_pos

    @property
    def get_pos(self):
        return self._pos
