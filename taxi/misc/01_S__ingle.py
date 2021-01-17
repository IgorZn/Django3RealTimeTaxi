# https://medium.com/@vubon.roy/solid-principles-with-python-examples-10e1f3d91259
# https://www.youtube.com/watch?v=A6wEkG4B38E&ab_channel=%D0%AF%D0%B7%D1%8B%D0%BAPython%D0%AF%D0%B7%D1%8B%D0%BAPython

class Auto:
	def __init__(self, model):
		self.model = model

	def get_car_model(self):
		return self.model


class CustomerAuto:
	def save_customer_order(self):
		pass

	def get_customer_order(self):
		pass

	def remove_customer_order(self):
		pass


class AutoDB:
	def update_car_set(self):
		pass


class GenericAuto(Auto, CustomerAuto, AutoDB):
	pass


auto = GenericAuto('bmv')