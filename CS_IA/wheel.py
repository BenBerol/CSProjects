class Wheel():

    """
    A read only class that represents a wheel.

    Parameters:
    - x_pos (float): The x position of the wheel.
    - y_pos (float): The y position of the wheel.

    Methods:
    - getx_pos(): Returns the x position of the wheel.
    - gety_pos(): Returns the y position of the wheel.
    - get_pos(): Returns the position of the wheel as a tuple.
    """

    def __init__(self, x_pos: float, y_pos: float):
        self._x_pos = x_pos
        self._y_pos = y_pos
        self._pos = (x_pos, y_pos)

    @property
    def getx_pos(self):
        return self._x_pos

    @property
    def gety_pos(self):
        return self._y_pos

    @property
    def get_pos(self):
        return self._pos
