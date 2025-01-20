class wheel_data:

    """
    A read only class that holds data for a wheel.

    Parameters:
    - timestamp (float): The time the data was recorded.
    - angle (float): The angle of the wheel.
    - speed (float): The speed of the wheel.

    Methods:
    - get_time(): Returns the time the data was recorded.
    - get_angle(): Returns the angle of the wheel.
    - get_speed(): Returns the speed of the wheel.
    - __setattr__(name, value): Raises an AttributeError if
    an attribute is modified.
    """

    def __init__(self, timestamp: float, angle: float, speed: float):
        self._timestamp = timestamp
        self._angle = angle
        self._speed = speed

    @property
    def get_time(self):
        return self._timestamp

    @property
    def get_angle(self):
        return self._angle

    @property
    def get_speed(self):
        return self._speed
    
    def __setattr__(self, name, value):
        if hasattr(self, name):
            raise AttributeError(f"Cannot modify attribute '{name}'")
        super().__setattr__(name, value)
