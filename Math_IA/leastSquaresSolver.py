import numpy as np

# Solves the least squares problem Ax = b
def least_squares_solver(A, b):
    A_transpose = np.transpose(A)
    A_transpose_A = np.dot(A_transpose, A)
    ATA_inverse = np.linalg.inv(A_transpose_A)
    A_transpose_b = np.dot(A_transpose, b)
    x = np.dot(ATA_inverse, A_transpose_b)
    return x

#Enter the matrix A and vector b here
def load_matrix_from_file(filename):
    with open(filename, 'r') as file:
        lines = file.readlines()
        matrix = [list(map(float, line.split())) for line in lines]
    return np.array(matrix)

A = load_matrix_from_file('dataTrig.txt')
print(A)
b = np.array([-0.0315, -0.084, -0.1365, -0.18165, -0.2436, -0.30135, -0.3633, -0.4242, -0.4704, -0.5145, -0.5523, -0.5775, -0.59325, -0.5985, -0.5859, -0.5733, -0.5355, -0.4767, -0.41685, -0.3465, -0.2625, -0.21, -0.15225, -0.1113, -0.07875, -0.042, -0.0042, 0.0357, 0.06615, 0.0987, 0.1155, 0.1197, 0.0987, 0.0084, -0.063, -0.1323, -0.19425, -0.2415, -0.26775, -0.29715])
x = least_squares_solver(A, b)

def print_matrix(name, matrix):
    print(f"{name}:\n{matrix}\n")

def print_vector(name, vector):
    print(f"{name}: {vector}\n")

print_matrix("Matrix A", A)
print_vector("Vector b", b)

A_transpose = np.transpose(A)
print_matrix("Transpose of A", A_transpose)

A_transpose_A = np.dot(A_transpose, A)
print_matrix("A^T * A", A_transpose_A)
print_matrix("Inverse of A^T * A", np.linalg.inv(A_transpose_A))

A_transpose_b = np.dot(A_transpose, b)
print_vector("A^T * b", A_transpose_b)

print("Solution x:", x)

# Calculate the approximation of b
b_approx = np.dot(A, x)
print("Approximation of b:", b_approx)

# Calculate the error
error = np.linalg.norm(b - b_approx)
print("Difference in b:", b - b_approx)
print("Error:", error)