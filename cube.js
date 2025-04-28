let g_cubeVertexBuffer = null;
let g_cubeVertices = null;

class Cube {
    constructor() {
        //this.position = position;  // center position [x, y]
        this.color = [1.0, 1.0, 1.0, 1.0];        // [r, g, b, a]
        //this.size = size;          // size factor
        //this.segments = segments;  // number of segments
        this.matrix = new Matrix4();

        // Initialize cube vertices and buffer if needed
        if (g_cubeVertices === null) {
            this.generateVertices();
        }

        if (g_cubeVertexBuffer === null) {
            g_cubeVertexBuffer = gl.createBuffer();
            if (!g_cubeVertexBuffer) {
                console.log('Failed to create the cube buffer object');
            }
            
            // Bind the buffer object to target
            gl.bindBuffer(gl.ARRAY_BUFFER, g_cubeVertexBuffer);
            
            // Write data into the buffer object
            gl.bufferData(gl.ARRAY_BUFFER, g_cubeVertices, gl.STATIC_DRAW);
        }
    }

    generateVertices() {
        // Create all cube vertices
        const vertices = [
            // Front face
            0.0,0.0,0.0, 1.0,1.0,0.0, 1.0,0.0,0.0,
            0.0,0.0,0.0, 0.0,1.0,0.0, 1.0,1.0,0.0,
            
            // Top face
            0.0,1.0,0.0, 0.0,1.0,1.0, 1.0,1.0,1.0,
            0.0,1.0,0.0, 1.0,1.0,1.0, 1.0,1.0,0.0,
            
            // Bottom face
            0.0,0.0,0.0, 0.0,0.0,1.0, 1.0,0.0,0.0,
            1.0,0.0,0.0, 1.0,0.0,1.0, 0.0,0.0,1.0,
            
            // Left face
            0.0,0.0,0.0, 0.0,1.0,0.0, 0.0,1.0,1.0,
            0.0,1.0,1.0, 0.0,0.0,0.0, 0.0,0.0,1.0,
            
            // Right face
            1.0,0.0,0.0, 1.0,1.0,0.0, 1.0,1.0,1.0,
            1.0,1.0,1.0, 1.0,0.0,0.0, 1.0,0.0,1.0,
            
            // Back face
            0.0,0.0,1.0, 1.0,1.0,1.0, 1.0,0.0,1.0,
            0.0,0.0,1.0, 0.0,1.0,1.0, 1.0,1.0,1.0
        ];
        
        g_cubeVertices = new Float32Array(vertices);
    }
    
    render(color) {
        var rgba = color || this.color;

        // Set the model matrix
        gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements);
        
        // Bind the shared buffer
        gl.bindBuffer(gl.ARRAY_BUFFER, g_cubeVertexBuffer);
        gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(a_Position);
        
        // Draw front face
        gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);
        gl.drawArrays(gl.TRIANGLES, 0, 6);
        
        // Draw top face with shading
        gl.uniform4f(u_FragColor, rgba[0]*.9, rgba[1]*.9, rgba[2]*.9, rgba[3]);
        gl.drawArrays(gl.TRIANGLES, 6, 6);
        
        // Draw bottom face with shading
        gl.uniform4f(u_FragColor, rgba[0]*.8, rgba[1]*.8, rgba[2]*.8, rgba[3]);
        gl.drawArrays(gl.TRIANGLES, 12, 6);
        
        // Draw left face with shading
        gl.uniform4f(u_FragColor, rgba[0]*.4, rgba[1]*.4, rgba[2]*.4, rgba[3]);
        gl.drawArrays(gl.TRIANGLES, 18, 6);
        
        // Draw right face with shading
        gl.uniform4f(u_FragColor, rgba[0]*.7, rgba[1]*.7, rgba[2]*.7, rgba[3]);
        gl.drawArrays(gl.TRIANGLES, 24, 6);
        
        // Draw back face with shading
        gl.uniform4f(u_FragColor, rgba[0]*.6, rgba[1]*.6, rgba[2]*.6, rgba[3]);
        gl.drawArrays(gl.TRIANGLES, 30, 6);
    }
}