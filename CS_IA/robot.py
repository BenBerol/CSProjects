import wheel as wh


class Robot():

    """
    A read only class that represents a robot.

    Parameters:
    - team_number (int): The team number of the robot.
    - robot_weight (float): The weight of the robot.
    - wheels (tuple of wheel objects): An immutable list of
    wheel objects in the robot

    Methods:
    - get_team_number(): Returns the team number of the robot.
    - get_robot_weight(): Returns the weight of the robot.
    - get_wheels(): Returns the list of wheel locations in the robot.
    - __setattr__(name, value): Raises an AttributeError if
    an attribute is modified.
    """

    def __init__(self, team_number: int, robot_weight: int, wheels: wh.Wheel):

        self._team_number = team_number
        self._robot_weight = robot_weight
        self._wheels = wheels

    @property
    def get_team_number(self):
        return self._team_number

    @property
    def get_robot_weight(self):
        return self._robot_weight

    @property
    def get_wheels(self):
        return self._wheels

    def __setattr__(self, name, value):
        if hasattr(self, name):
            raise AttributeError(f"Cannot modify attribute '{name}'")
        super().__setattr__(name, value)
