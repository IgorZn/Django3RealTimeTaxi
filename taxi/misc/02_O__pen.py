class CarPrice:
	def get_price(self):
		raise NotImplementedError()


class Tesla(CarPrice):
	def get_price(self):
		return 10


class BMW(CarPrice):
	def get_price(self):
		return 20


class LADA(CarPrice):
	def get_price(self):
		return 30


cars = [Tesla(), BMW(), LADA()]
prices = [x.get_price() for x in cars]
print(prices)