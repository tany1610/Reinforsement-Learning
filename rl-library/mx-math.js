class Matrix {
  constructor(rows, cols, matrix = null) {
    this.value = [];
    this.rows = rows || matrix.length;
    this.cols = cols || matrix[0].length;
    if (matrix) {
      for (let row = 0; row < this.rows; row++) {
        this.value[row] = [];
        for (let col = 0; col < this.cols; col++) {
          this.value[row][col] = matrix[row][col];
          if (!matrix[row][col]) {
            throw new Error('x and y do not match with the dimensions of the matrix.');
          }
        }
      }
    } else {
      for (let row = 0; row < this.rows; row++) {
        this.value[row] = [];
        for (let col = 0; col < this.cols; col++) {
          this.value[row][col] = 1;
        }
      }
    }
  }

  randomize() {
    for (let row = 0; row < this.rows; row++) {
      for (let col = 0; col < this.cols; col++)
        this.value[row][col] = Math.random() /** 3 + 1*/ ;
    }
  }

  add(x) {
    if (x instanceof Matrix) {
      if (this.rows !== x.rows || this.cols !== x.cols) {
        throw new Error('rows and columns of the matrices must match');
      }
      for (let row = 0; row < this.rows; row++) {
        for (let col = 0; col < this.cols; col++) {
          this.value[row][col] += x.value[row][col];
        }
      }
    } else if (+x) {
      for (let row = 0; row < this.rows; row++) {
        for (let col = 0; col < this.cols; col++) {
          this.value[row][col] += x;
        }
      }
    } else {
      throw new Error('added value must either be Matrix or a number');
    }
  }

  // element wise multiplication
  multiply(x) {
    if (+x) {
      for (let row = 0; row < this.rows; row++) {
        for (let col = 0; col < this.cols; col++) {
          this.value[row][col] *= x;
        }
      }
    } else if (x instanceof Matrix) {
      for (let row = 0; row < this.rows; row++) {
        for (let col = 0; col < this.cols; col++) {
          this.value[row][col] *= x.value[row][col];
        }
      }
    } else {
      throw new Error('multiplication value must either be Matrix or a number');
    }
  }

  // mapping the matrix to a function
  map(f) {
    if (typeof x !== "function") {
      throw new Error ('map parameter must be a function')
    }
    for (let row = 0; row < this.rows; row++) {
      for (let col = 0; col < this.cols; col++) {
        this.value[row][col] = f(this.value[row][col]);
      }
    }
  }

  print() {
    console.table(this.value);
  }

  // static functions
  static fromArray(arr) {
    if (arr instanceof Array === false) {
      throw new Error('parameter must be an array');
    }
    let result = new Matrix(arr.length, 1);
    for (let row = 0; row < arr.length; row++) {
      for (let col = 0; col < 1; col++) {
        result.value[row][col] = arr[row];
      }
    }
    return result;
  }

  static toArray(m) {
    if (m instanceof Matrix === false) {
      throw new Error('parameter must be an instance of a Matrix');
    }
    let result = [];
    for (let row = 0; row < m.rows; row++) {
      for (let col = 0; col < m.cols; col++) {
        result.push(m.value[row][col]);
      }
    }
    return result;
  }

  // dot product
  static multiply(m1, m2) {
    if (m1 instanceof Matrix === false || m2 instanceof Matrix === false) {
      throw new Error('both parameters must be an instance of a Matrix');
    }
    let result = new Matrix(m1.rows, m2.cols);
    for (let row = 0; row < result.rows; row++) {
      for (let col = 0; col < result.cols; col++) {
        let sum = 0;
        for (let k = 0; k < m1.cols; k++) {
          sum += m1.value[row][k] * m2.value[k][col];
        }
        result.value[row][col] = sum;
      }
    }
    return result;
  }

  // element wise subtraction
  static subtract(m1, m2) {
    if (m1 instanceof Matrix === false || m2 instanceof Matrix === false) {
      throw new Error('both parameters must be an instance of a Matrix');
    }
    let result = new Matrix(m1.rows, m1.cols);
    for (let row = 0; row < result.rows; row++) {
      for (let col = 0; col < result.cols; col++) {
        result.value[row][col] = m1.value[row][col] - m2.value[row][col];
      }
    }
    return result;
  }

  static transpose(m) {
    if (m instanceof Matrix === false) {
      throw new Error('parameter must be an instance of a Matrix');
    }
    let result = new Matrix(m.cols, m.rows);
    for (let row = 0; row < result.rows; row++) {
      for (let col = 0; col < result.cols; col++) {
        result.value[row][col] = m.value[col][row];
      }
    }
    return result;
  }
}