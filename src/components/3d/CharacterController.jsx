import { CapsuleCollider, RigidBody } from '@react-three/rapier';
import { Avatar } from './Avatar';
import { useRef } from 'react';
import { Vector3 } from 'three';
import { useFrame } from '@react-three/fiber';

export const CharacterController = () => {
	const container = useRef();
	const character = useRef();
	const cameraTarget = useRef();
	const cameraPosition = useRef();

	const cameraWorldPosition = useRef(new Vector3())
	const cameraLookAtWorldPosition = useRef(new Vector3())
	const cameraLookAt = useRef(new Vector3())

	useFrame(({camera}) => {
		cameraPosition.current.getWorldPosition(cameraWorldPosition.current);
		camera.position.lerp(cameraWorldPosition.current);

		if (cameraTarget.current) {
			cameraTarget.current.getWorldPosition(cameraLookAtWorldPosition.current);
			cameraLookAt.current.lerp(cameraLookAtWorldPosition.current);

			camera.lookAt(cameraLookAt.current);
		}
	});

    return (
			<RigidBody colliders={false} lockRotations>
				<group ref={container}>
					<group ref={cameraTarget} position-z={1.5} />
					<group ref={cameraPosition} position-y={4} position-z={-4} />
					<group ref={character}>
						<Avatar />
					</group>
				</group>
				<CapsuleCollider args={[0.08, 0.15 ]} />
			</RigidBody>
    )
}