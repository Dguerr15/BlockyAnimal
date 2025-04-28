class Cylinder {
    constructor() {
        this.color = [1.0, 1.0, 1.0, 1.0];  // [r, g, b, a]
        this.matrix = new Matrix4();
        this.segments = 12;  // Number of segments around the cylinder
    }
    
    render(color) {
        var rgba = color || this.color;
        gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);
        gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements);
        
        const segments = this.segments;
        const angleStep = 360 / segments;
        
        // Draw the cylinder sides
        for (let i = 0; i < segments; i++) {
            const angle1 = i * angleStep;
            const angle2 = ((i + 1) % segments) * angleStep;
            
            const x1 = 0.5 * Math.cos(angle1 * Math.PI / 180);
            const z1 = 0.5 * Math.sin(angle1 * Math.PI / 180);
            const x2 = 0.5 * Math.cos(angle2 * Math.PI / 180);
            const z2 = 0.5 * Math.sin(angle2 * Math.PI / 180);
            
            // Each side is made of two triangles
            // First triangle (top half)
            drawTriangle3D([
                x1, 0.0, z1,
                x2, 0.0, z2,
                x1, 1.0, z1
            ]);
            
            // Second triangle (bottom half)
            drawTriangle3D([
                x1, 1.0, z1,
                x2, 0.0, z2,
                x2, 1.0, z2
            ]);
            
            // Adjust shading based on angle for 3D effect
            const shadeFactor = 0.7 + 0.3 * Math.abs(Math.cos(angle1 * Math.PI / 180));
            gl.uniform4f(u_FragColor, rgba[0] * shadeFactor, rgba[1] * shadeFactor, rgba[2] * shadeFactor, rgba[3]);
        }
        
        // Draw the top circle
        gl.uniform4f(u_FragColor, rgba[0] * 0.9, rgba[1] * 0.9, rgba[2] * 0.9, rgba[3]);
        for (let i = 0; i < segments; i++) {
            const angle1 = i * angleStep;
            const angle2 = ((i + 1) % segments) * angleStep;
            
            const x1 = 0.5 * Math.cos(angle1 * Math.PI / 180);
            const z1 = 0.5 * Math.sin(angle1 * Math.PI / 180);
            const x2 = 0.5 * Math.cos(angle2 * Math.PI / 180);
            const z2 = 0.5 * Math.sin(angle2 * Math.PI / 180);
            
            drawTriangle3D([
                0.0, 1.0, 0.0,
                x1, 1.0, z1,
                x2, 1.0, z2
            ]);
        }
        
        // Draw the bottom circle
        gl.uniform4f(u_FragColor, rgba[0] * 0.8, rgba[1] * 0.8, rgba[2] * 0.8, rgba[3]);
        for (let i = 0; i < segments; i++) {
            const angle1 = i * angleStep;
            const angle2 = ((i + 1) % segments) * angleStep;
            
            const x1 = 0.5 * Math.cos(angle1 * Math.PI / 180);
            const z1 = 0.5 * Math.sin(angle1 * Math.PI / 180);
            const x2 = 0.5 * Math.cos(angle2 * Math.PI / 180);
            const z2 = 0.5 * Math.sin(angle2 * Math.PI / 180);
            
            drawTriangle3D([
                0.0, 0.0, 0.0,
                x1, 0.0, z1,
                x2, 0.0, z2
            ]);
        }
    }
}