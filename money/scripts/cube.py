import bpy
import bmesh
import numpy as np
import sys

argv = sys.argv
argv = argv[argv.index("--") + 1 :]


def human_format(num):
    magnitude = 0
    while abs(num) >= 1000:
        magnitude += 1
        num /= 1000.0
    # add more suffixes if you need them
    output = "%.2f%s" % (num, ["", "K", "M", "B", "T", "Q"][magnitude])
    output = output.replace(".", "_")
    return output


# @click.command()
# @click.argument("value", type=click.INT)
def main():
    value = int(argv[0])

    bpy.ops.object.select_all(action="SELECT")
    bpy.ops.object.delete()

    # dimensions of a single 10K bundle in blenders units (meters)
    # all relative to each other
    blender_d = 0.25
    blender_l = 2.63
    blender_h = 1.13

    # value = 900000000
    file_name = human_format(value)
    bundles = value / 10000

    # physical dimensions of a 10K bundle in mm
    length = 156
    height = 66
    depth = 10

    alpha = np.cbrt(bundles * length * height * depth)

    # number of bills in each direction
    l = round(alpha / length)
    h = round(alpha / height)
    d = round(alpha / depth)

    print(f"{l*length}mm x {h*height}mm x {d*depth}mm")
    print(f"{l*length*0.03937008}in x {h*height*0.03937008}in x {d*depth*0.03937008}in")
    print(f"{l*length*0.00328084}ft x {h*height*0.00328084}ft x {d*depth*0.00328084}ft")

    cube = bpy.ops.mesh.primitive_cube_add(
        size=1, location=(0, 0, 0), scale=(d * blender_d, l * blender_l, h * blender_h)
    )

    # setup nodes
    mat = bpy.data.materials.new(name="material")
    mat.use_nodes = True
    nodes = mat.node_tree.nodes
    links = mat.node_tree.links

    # create image node
    image_node = nodes.new("ShaderNodeTexImage")
    image_node.location = (-300, 200)
    image_node.image = bpy.data.images.load(f"../blender/imgs/{file_name}.jpg")

    # get bsdf node
    bsdf_node = nodes["Principled BSDF"]

    # connect image output to BSDF input
    mat.node_tree.links.new(image_node.outputs["Color"], bsdf_node.inputs["Base Color"])

    # apply nodes to cube
    cube = bpy.context.active_object
    cube.data.materials.append(mat)

    bpy.ops.object.mode_set(mode="EDIT")

    mesh = cube.data
    bm = bmesh.from_edit_mesh(mesh)

    bm.faces.ensure_lookup_table()
    uv_layer = bm.loops.layers.uv[0]

    # bm.faces
    # 0 - back
    # 1 - right side
    # 2 - front
    # 3 - left side
    # 4 - bottom
    # 5 - top

    # loops
    # 0 - bottom left
    # 1 - top left
    # 2 - top right
    # 3 - bottom right

    # set front face uv map
    bm.faces[2].loops[0][uv_layer].uv = (0, 0.5)
    bm.faces[2].loops[1][uv_layer].uv = (0, 1)
    bm.faces[2].loops[2][uv_layer].uv = (0.5, 1)
    bm.faces[2].loops[3][uv_layer].uv = (0.5, 0.5)

    # set back face uv map
    bm.faces[0].loops[0][uv_layer].uv = (0, 0.5)
    bm.faces[0].loops[1][uv_layer].uv = (0, 0)
    bm.faces[0].loops[2][uv_layer].uv = (0.5, 0)
    bm.faces[0].loops[3][uv_layer].uv = (0.5, 0.5)

    # set right side face uv map
    bm.faces[1].loops[0][uv_layer].uv = (0.5, 0)
    bm.faces[1].loops[1][uv_layer].uv = (0.5, 1)
    bm.faces[1].loops[2][uv_layer].uv = (1, 1)
    bm.faces[1].loops[3][uv_layer].uv = (1, 0)

    # set left side face uv map
    bm.faces[3].loops[0][uv_layer].uv = (0.5, 0)
    bm.faces[3].loops[1][uv_layer].uv = (0.5, 1)
    bm.faces[3].loops[2][uv_layer].uv = (1, 1)
    bm.faces[3].loops[3][uv_layer].uv = (1, 0)

    bpy.ops.wm.save_as_mainfile(filepath=f"../blender/{file_name}.blend")

    bpy.ops.export_scene.gltf(
        filepath=f"../public/{file_name}.gltf",
        export_yup=False,
    )


if __name__ == "__main__":
    main()
