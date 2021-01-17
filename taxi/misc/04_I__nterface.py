# -- Example, Violation of ISP

class Shape:
	"""A demo shape class"""
	def draw_circle(self):
		"""Draw a circle"""
		raise NotImplemented

	def draw_square(self):
		""" Draw a square"""
		raise NotImplemented


class Circle(Shape):
	"""A demo circle class"""
	def draw_circle(self):
		"""Draw a circle"""
		pass

	def draw_square(self):
		""" Draw a square"""
		pass


# Solution

class Shape:
	"""A demo shape class"""
	def draw(self):
		"""Draw a shape"""
		raise NotImplemented


class Circle(Shape):
	"""A demo circle class"""
	def draw(self):
		"""Draw a circle"""
		pass


class Square(Shape):
	"""A demo square class"""
	def draw(self):
		"""Draw a square"""
		pass