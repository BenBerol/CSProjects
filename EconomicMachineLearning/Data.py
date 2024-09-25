class Data:
    def __init__(self, date=0, hai=0, medianIncome=0, medianHousePrice=0, interestRates=0, population=0, unemploymentRate=0):
        self.date = date
        self.hai = hai
        self.medianIncome = medianIncome
        self.medianHousePrice = medianHousePrice
        self.interestRates = interestRates
        self.population = population
        self.unemploymentRate = unemploymentRate
        
    def to_dict(self):
        return {
            "date": self.date,
            "hai": self.hai,
            "medianIncome": self.medianIncome,
            "medianHousePrice": self.medianHousePrice,
            "interestRates": self.interestRates,
            "population": self.population,
            "unemploymentRate": self.unemploymentRate
        }
    
    @classmethod
    def from_dict(cls, data_dict):
        return cls(**data_dict)