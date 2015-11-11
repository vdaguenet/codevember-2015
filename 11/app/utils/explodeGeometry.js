import THREE from 'three'


function explodeGeometry(geom) {


  let vertices = geom.vertices
  let faces = geom.faces
  let vertexUv = geom.faceVertexUvs[0]

  let temp = new THREE.Geometry()


  var i = 0
  var c = 0

  while(i < faces.length) {

      temp.vertices.push( vertices[faces[i].a].clone() )
      temp.vertices.push( vertices[faces[i].b].clone() )
      temp.vertices.push( vertices[faces[i].c].clone() )

      temp.faceVertexUvs[0][i] =  vertexUv[i]

      let face = new THREE.Face3(c++, c++, c++)

      face.vertexNormals[0] = faces[i].vertexNormals[0].clone()
      face.vertexNormals[1] = faces[i].vertexNormals[1].clone()
      face.vertexNormals[2] = faces[i].vertexNormals[2].clone()

      face.normal = faces[i].normal.clone()


      temp.faces[i] = face

      i++
  }

  return temp

}


export default explodeGeometry
