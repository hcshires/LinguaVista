import React, { useEffect,useRef, useState  } from "react";
import { Button, ConfigProvider } from "antd";
interface WebGLTypes {
	Matrix4: number[];
	Vec3: [number, number, number];
	MeshData: {
	  type: number;
	  mesh: Float32Array;
	};
  }
  
  // Type aliases for easier use
  type Matrix4 = WebGLTypes['Matrix4'];
  type Vec3 = WebGLTypes['Vec3'];
  type MeshData = WebGLTypes['MeshData'];
  
const Bubble: React.FC = ({ setThinking }) => {
	const canvasRef = useRef<HTMLCanvasElement | null>(null);
	const [noiseValue, setNoiseValue] = useState<number>(0.1);
	const [color, setColor] = useState<string>("vec3(0.0, 0.5, 0.5), vec3(0.0, 1.0, 0.9)");
	const [zScale, setZScale] = useState<number>(0.5);
	const [isForward, setIsForward] = useState(true);
	const [thoughts, setThoughts] = useState<string>("Hi! I'm your AI assistant. Ask me anything and give me a nudge!");

	  // Create animation function
	  const startAnimation = () => {
		setThinking(true);
		setThoughts("Thinking...");

		// Initial and target values
		const initialValues = {
		  noise: 0.1,
		  zScale: 0.5,
		  color: "vec3(0.0, 0.5, 0.5), vec3(0.0, 1.0, 0.9)"
		};
	
		const targetValues = {
		  noise: 0.2,
		  zScale: 2.,
		  color: "vec3(1.0, 0., 0.5), vec3(1.0, 1.0, 0.4)"
		};
	
		// Set start and end based on direction
		const start = isForward ? initialValues : targetValues;
		const end = isForward ? targetValues : initialValues;
	
		const transitionDuration = 500;
		const steps = 200;
		const interval = transitionDuration / steps;
		
		const noiseIncrement = (end.noise - start.noise) / steps;
		const zScaleIncrement = (end.zScale - start.zScale) / steps;
		
		const timer = setInterval(() => {
		  setNoiseValue(prev => {
			if (Math.abs(prev - end.noise) < Math.abs(noiseIncrement)) {
			  return end.noise;
			}
			return prev + noiseIncrement;
		  });
		
		  setZScale(prev => {
			if (Math.abs(prev - end.zScale) < Math.abs(zScaleIncrement)) {
			  return end.zScale;
			}
			return prev + zScaleIncrement;
		  });
		
		  setColor(end.color);
		}, interval);
	
		// Clear interval and toggle direction after animation completes
		setTimeout(() => {
		  clearInterval(timer);
		  setIsForward(!isForward);
		  setThoughts("");
		}, transitionDuration);
	  };
	
	const mIdentity = (): Matrix4 => [1,0,0,0, 0,1,0,0, 0,0,1,0, 0,0,0,1];
	
	const mInverse = (m: Matrix4): Matrix4 => {
	  let dst: number[] = [], det = 0;
	  const cofactor = (c: number, r: number): number => {
		let s = (i: number, j: number): number => m[c+i & 3 | (r+j & 3) << 2];
		return (c+r & 1 ? -1 : 1) * ((s(1,1) * (s(2,2) * s(3,3) - s(3,2) * s(2,3)))
								   - (s(2,1) * (s(1,2) * s(3,3) - s(3,2) * s(1,3)))
								   + (s(3,1) * (s(1,2) * s(2,3) - s(2,2) * s(1,3))));
	  }
	  for (let n = 0; n < 16; n++) dst.push(cofactor(n >> 2, n & 3));
	  for (let n = 0; n < 4; n++) det += m[n] * dst[n << 2];
	  for (let n = 0; n < 16; n++) dst[n] /= det;
	  return dst;
	}
  
	const matrixMultiply = (a: Matrix4, b: Matrix4): Matrix4 => {
	  let dst: number[] = [];
	  for (let n = 0; n < 16; n++)
		dst.push(a[n&3]*b[n&12] + a[n&3|4]*b[n&12|1] + a[n&3|8]*b[n&12|2] + a[n&3|12]*b[n&12|3]);
	  return dst;
	}
  
	const mTranslate = (tx: number, ty: number, tz: number, m: Matrix4): Matrix4 => {
	  return matrixMultiply(m, [1,0,0,0, 0,1,0,0, 0,0,1,0, tx,ty,tz,1]);
	}
  
	const mScale = (sx: number, sy: number, sz: number, m: Matrix4): Matrix4 => {
	  return matrixMultiply(m, [sx,0,0,0, 0,sy,0,0, 0,0,sz,0, 0,0,0,1]);
	}
  
	const sphere = (nu: number, nv: number): number[] => {
	  let mesh: number[] = [];
	  let p = (u: number, v: number): number[] => {
		let theta = 2 * Math.PI * u;
		let phi = Math.PI * (v - .5);
		let x = Math.cos(phi) * Math.cos(theta),
			y = Math.cos(phi) * Math.sin(theta),
			z = Math.sin(phi);
		return [x,y,z, x,y,z];
	  }
	  for (let j = 0; j < nv; j++)
		for (let i = 0; i < nu; i++) {
		  let u = i/nu, v = j/nv;
		  let p00 = p(u, v);
		  let p10 = p(u+1/nu, v);
		  let p01 = p(u, v+1/nv);
		  let p11 = p(u+1/nu, v+1/nv);
		  mesh.push(...p00, ...p10, ...p11);
		  mesh.push(...p11, ...p01, ...p00);
		}
	  return mesh;
	}
  
	const vertexShader = `
	  attribute vec3 aPos, aNor;
	  uniform mat4 uMatrix, uInvMatrix;
	  uniform float uTime;
	  uniform float uAmplitude;
	  varying vec3 vPos, vNor;
  
	  vec3 noisePosition() {
		vec3 timeVector = vec3(cos(uTime), sin(uTime), sin(uTime));
		return timeVector + gl_Position.xyz;
	  }
  
	  float noise(vec3 point) { 
		float r = 0.; 
		for (int i=0;i<16;i++) {
		  vec3 D, p = point + mod(vec3(i,i/4,i/8) , vec3(4.0,2.0,2.0)) +
				1.7*sin(vec3(i,5*i,8*i)), C=floor(p), P=p-C-.5, A=abs(P);
		  C += mod(C.x+C.y+C.z,2.) * step(max(A.yzx,A.zxy),A) * sign(P);
		  D=34.*sin(987.*float(i)+876.*C+76.*C.yzx+765.*C.zxy);P=p-C-.5;
		  r+=sin(6.3*dot(P,fract(D)-.5))*pow(max(0.,1.-2.*dot(P,P)),4.);
		} 
		return .5 * sin(r); 
	  }
		   
	  float customNoiseValue() {
		float amplitude = uAmplitude;
		vec3 position = noisePosition();
		return amplitude * noise(position);
	  }
  
	  vec3 getOffset() {
		float noiseValue = customNoiseValue();
		return noiseValue * aNor;
	  }
		  
	  void main() {
		vec4 pos = uMatrix * vec4(aPos, 1.0);
		vec4 nor = vec4(aNor, 0.0) * uInvMatrix;
		vPos = pos.xyz;
		vNor = nor.xyz;
		gl_Position = pos * vec4(1.,1.,-.1,1.);
		gl_Position += vec4(getOffset(), 0.);
	  }
	`;
  
	const fragmentShader = `
	  precision mediump float;
	  varying vec3 vPos, vNor;
  
	  vec3 getViewDirection() {
		return normalize(vec3(0., 0., 3.) - vPos);
	  }
  
	  float getMixValue() {
		vec3 viewDirection = getViewDirection();
		return max(0., dot(normalize(vNor), viewDirection));
	  }
  
	  vec3 getMixedValueColor() {
		float mixValue = getMixValue();
		vec3 mixColor = mix(`+color+`, mixValue);
		return mixColor;
	  }
  
	  void main(void) {
		float c = .05 + max(0., dot(normalize(vNor), vec3(.57)));
		vec3 color = vec3(c) * getMixedValueColor();
		gl_FragColor = vec4(sqrt(color), 0.7);
	  }
	`;
  
	useEffect(() => {
	  const canvas = canvasRef.current;
	  if (!canvas) return;
  
	  const gl = canvas.getContext('webgl');
	  if (!gl) return;
  
	  const program = gl.createProgram();
	  if (!program) return;
	  
	  const addShader = (type: number, src: string): void => {
		const shader = gl.createShader(type);
		if (!shader) return;
		
		gl.shaderSource(shader, src);
		gl.compileShader(shader);
		if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
		  console.error("Shader compilation error:", gl.getShaderInfoLog(shader));
		  return;
		}
		gl.attachShader(program, shader);
	  };
  
	  addShader(gl.VERTEX_SHADER, vertexShader);
	  addShader(gl.FRAGMENT_SHADER, fragmentShader);
	  gl.linkProgram(program);
  
	  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
		console.error("Program linking error:", gl.getProgramInfoLog(program));
		return;
	  }
  
	  gl.useProgram(program);
	  
	  const vertexBuffer = gl.createBuffer();
	  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
	  
	  gl.enable(gl.DEPTH_TEST);
	  gl.depthFunc(gl.LEQUAL);
  
	  const vertexSize = 6;
	  const meshData = [
		{ type: 0, mesh: new Float32Array(sphere(80, 40)) }
	  ];
  
	  const vertexAttribute = (name: string, size: number, position: number): void => {
		const attr = gl.getAttribLocation(program, name);
		gl.enableVertexAttribArray(attr);
		gl.vertexAttribPointer(attr, size, gl.FLOAT, false, vertexSize * 4, position * 4);
	  };
  
	  vertexAttribute('aPos', 3, 0);
	  vertexAttribute('aNor', 3, 3);
  
	  const uMatrix = gl.getUniformLocation(program, "uMatrix");
	  const uInvMatrix = gl.getUniformLocation(program, "uInvMatrix");
	  const uTime = gl.getUniformLocation(program, "uTime");
	  const uAmplitude = gl.getUniformLocation(program, "uAmplitude");
	  
	  const startTime = Date.now() / 1000;
	  
	  const animate = () => {
		const time = Date.now() / 1000 - startTime;
		if (uTime) gl.uniform1f(uTime, time);
		if (uAmplitude) gl.uniform1f(uAmplitude, noiseValue);
  
		for (let n = 0; n < meshData.length; n++) {
		  let m = mIdentity();
		  m = mTranslate(0., 0, 0, m);
		//   m = mScale(0.5, 0.5, zScale, m);
		m = mScale(0.9, 0.9, zScale, m);
  
		  if (uMatrix) gl.uniformMatrix4fv(uMatrix, false, m);
		  if (uInvMatrix) gl.uniformMatrix4fv(uInvMatrix, false, mInverse(m));
  
		  const mesh = meshData[n].mesh;
		  gl.bufferData(gl.ARRAY_BUFFER, mesh, gl.STATIC_DRAW);
		  gl.drawArrays(meshData[n].type ? gl.TRIANGLE_STRIP : gl.TRIANGLES, 0, mesh.length / vertexSize);
		}
  
		requestAnimationFrame(animate);
	  };
  
	  animate();
  
	  return () => {
		if (vertexBuffer) gl.deleteBuffer(vertexBuffer);
		gl.deleteProgram(program);
	  };
	}, [zScale, noiseValue]);
	
	return (
		// <ConfigProvider theme={{ token: { colorPrimary: "#00b96b" } }}>
		// 	<div className="App">
			<div className="flex flex-col items-center bg-black p-4 w-full">
			<div>{thoughts}</div>
			<canvas 
				ref={canvasRef} 
				width={500} 
				height={500} 
				className="mb-4"
				onClick={startAnimation}
			/>
			</div>
		// 	</div>
		// </ConfigProvider>
	);
};

export default Bubble;