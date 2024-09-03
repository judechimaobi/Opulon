/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
Command: npx gltfjsx@6.4.1 public\models\bifrost.glb 
Author: Valerii_Melnychenko (https://sketchfab.com/Valerii_Melnychenko)
License: CC-BY-4.0 (http://creativecommons.org/licenses/by/4.0/)
Source: https://sketchfab.com/3d-models/magic-portal-88a7c64fa3d3431b8cd22e8fedc71e78
Title: Magic Portal
*/

import React from 'react'
import { useGLTF } from '@react-three/drei'

export function Bifrost(props) {
  const { nodes, materials } = useGLTF('models/bifrost.glb')
  return (
    <group {...props} dispose={null}>
      <group rotation={[-Math.PI / 2, 0, 0]}>
        <mesh geometry={nodes.Object_2.geometry} material={materials.Chan_Texturelambert2SG} />
        <mesh geometry={nodes.Object_3.geometry} material={materials.ShieldaiStandardSurface2SG} />
        <mesh geometry={nodes.Object_4.geometry} material={materials.aiStandardSurface1SG} />
        <mesh geometry={nodes.Object_5.geometry} material={materials.aiStandardSurface3SG} />
        <mesh geometry={nodes.Object_6.geometry} material={materials.aiStandardSurface2SG} />
        <mesh geometry={nodes.Object_7.geometry} material={materials.aiStandardSurface5SG} />
        <mesh geometry={nodes.Object_8.geometry} material={materials.Arch_TextureaiStandardSurface1SG} />
        <mesh geometry={nodes.Object_9.geometry} material={materials.Colum_singlelambert2SG} />
        <mesh geometry={nodes.Object_10.geometry} material={materials.Fire_BricksaiStandardSurface1SG} />
        <mesh geometry={nodes.Object_11.geometry} material={materials.aiStandardSurface4SG} />
      </group>
    </group>
  )
}

useGLTF.preload('models/bifrost.glb')
