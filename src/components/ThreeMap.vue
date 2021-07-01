<!--
 * @Author: Ricardo
 * @Date: 2021-06-30 11:04:56
 * @LastEditTime: 2021-07-01 11:24:21
 * @LastEditors: Ricardo
 * @Description: 
 * @FilePath: \cesium-in-use\src\components\ThreeMap.vue
 * 没有bug就没有伤害~
-->
<template>
  <div id="container">
    <div id="cesiumContainer"></div>
  </div>
</template>

<script>
//UrlTemplateImageryProvider,ArcGisMapServerImageryProvider,
// import { Viewer } from 'cesium'
import * as Cesium from 'cesium'
import { gcj02towgs84 } from '@/utils/coordinate'
import 'cesium/Build/Cesium/Widgets/widgets.css'
export default {
  data() {
    return {
      Cesium: null,
      isPop: false,
      entityBill: null,
      entityPoint: null,
      viewer: null,
      styleObj: {
        top: 0,
        left: 0,
      },
    }
  },
  mounted() {
    this.initViewer()
  },
  methods: {
    initViewer() {
      const centre = [120.76021099125664, 30.75518068041135, 15000.0]
      const tdNh = [120.7564551, 30.757402] // 天地图南湖 直接可以用
      const tdNh1 = [120.7407961477153, 30.736912374573894] // 天地图南湖 直接可以用
      const point1 = gcj02towgs84(...tdNh, 0) //[...tdNh, 0] //transformGCJ2WGS(120.76021456914029, 30.755173945204433, 0)
      const point2 = gcj02towgs84(...tdNh1, 0)
      const dysqUrl = 'http://192.168.1.81:8080/dy/3dtileset/tileset.json'
      const dytUrl = 'http://192.168.1.81:8080/3dtilesData/tileset.json'
      const token = '48900c9bbb47f35f7583f59f75687296'

      const viewer = new Cesium.Viewer('cesiumContainer', {
        //放大镜图标，查找位置工具，查找到之后会将镜头对准找到的地址，默认使用bing地图
        geocoder: true,
        //房子图标，视角返回初始位置
        homeButton: false,
        //经纬网图标，选择视角的模式，有三种：3D，2D，哥伦布视图（2.5D)
        sceneModePicker: true,
        //地图图标，图层选择器，选择要显示的地图服务和地形服务
        baseLayerPicker: true,
        //问号图标，导航帮助按钮，显示默认的地图控制帮助
        navigationHelpButton: false,
        //动画器件，显示当前时间，允许跳转特定时间
        animation: false,
        //时间轴
        timeline: false,
        //全屏图标，全屏按钮
        fullscreenButton: false,
        //虚拟现实
        vrButton: false,
        //阴影
        shadows: false,
        //点击后显示详细信息
        infoBox: false,
        //展示数据版权属性
        CreditsDisplay: false,
        //下载的底图
        imageryProvider: WebMapTileServiceImageryProvider,
      })
      //显示每秒的帧数和帧之间的时间
      viewer.scene.debugShowFramesPerSecond = true
      viewer._cesiumWidget._creditContainer.style.display = 'none'
      viewer.scene.globe.showGroundAtmosphere = false

      // let googleMapProvider = new Cesium.UrlTemplateImageryProvider({
      //   url: 'http://mt1.google.cn/vt/lyrs=s&hl=zh-CN&x={x}&y={y}&z={z}&s=Gali',
      // })
      // let ArcGisMapProvider = new Cesium.ArcGisMapServerImageryProvider({
      //   url: 'https://server.arcgisonline.com/arcgis/rest/services/World_Terrain_Base/MapServer',
      // })
      // let tiandiMapProvider = new Cesium.WebMapTileServiceImageryProvider({
      //   url: 'http://t0.tianditu.com/vec_w/wmts?service=wmts&request=GetTile&version=1.0.0&LAYER=vec&tileMatrixSet=w&TileMatrix={TileMatrix}&TileRow={TileRow}&TileCol={TileCol}&style=default&format=tiles&tk=d6a72a78a43a2c17294b72ab26354cd6',
      //   layer: 'tdtBasicLayer',
      //   style: 'default',
      //   format: 'image/jpeg',
      //   tileMatrixSetID: 'GoogleMapsCompatible',
      // })

      const WebMapTileServiceImageryProvider = new Cesium.WebMapTileServiceImageryProvider({
        url:
          'http://t0.tianditu.gov.cn/img_c/wmts?service=wmts&request=GetTile&version=1.0.0&LAYER=img&tileMatrixSet=c&TileMatrix={TileMatrix}&TileRow={TileRow}&TileCol={TileCol}&style=default&format=tiles&tk=' +
          token,
        format: 'tiles',
        tileMatrixSetID: 'c',
        tilingScheme: new Cesium.GeographicTilingScheme(),
        tileMatrixLabels: [
          '1',
          '2',
          '3',
          '4',
          '5',
          '6',
          '7',
          '8',
          '9',
          '10',
          '11',
          '12',
          '13',
          '14',
          '15',
          '16',
          '17',
          '18',
        ],
        layer: 'tdtImgAnnoLayer',
        style: 'default',
        show: false,
      })
      const palaceTileset = new Cesium.Cesium3DTileset({
        url: dytUrl,
        maximumScreenSpaceError: 16, //最大的屏幕空间误差
        maximumMemoryUsage: 2000, //可以使用的MB中的最大内存量。
        //modelMatrix: m
      })
      // 添加Cesium3DTileset 并贴地显示
      palaceTileset.readyPromise
        .then((tileset) => {
          viewer.scene.primitives.add(tileset)
          // viewer.zoomTo(
          //   tileset,
          //   new Cesium.HeadingPitchRange(0.5, -0.2, tileset.boundingSphere.radius * 1.0)
          // )
          this.changeHeight(20, tileset)
          //创建平移矩阵方法二
          // var translation=Cesium.Cartesian3.fromArray([0, 0, -2000]);
          // m= Cesium.Matrix4.fromTranslation(translation);
          //
          // //生效
          // tileset._modelMatrix = m;
        })
        .otherwise(function (error) {
          console.log(error)
        })

      //创建Cesium3DTileset
      const dyTileset = new Cesium.Cesium3DTileset({
        url: dysqUrl,
        maximumScreenSpaceError: 16, //最大的屏幕空间误差
        maximumMemoryUsage: 2000, //可以使用的MB中的最大内存量。
        //modelMatrix: m
      })
      // 添加Cesium3DTileset 并贴地显示
      dyTileset.readyPromise
        .then((tileset) => {
          viewer.scene.primitives.add(tileset)
          // viewer.zoomTo(
          //   tileset,
          //   new Cesium.HeadingPitchRange(0.5, -0.2, tileset.boundingSphere.radius * 1.0)
          // )
          this.changeHeight(20, tileset)
          //创建平移矩阵方法二
          // var translation=Cesium.Cartesian3.fromArray([0, 0, -2000]);
          // m= Cesium.Matrix4.fromTranslation(translation);
          //
          // //生效
          // tileset._modelMatrix = m;
        })
        .otherwise(function (error) {
          console.log(error)
        })
      viewer.camera.flyTo({
        // fromDegrees()方法，将经纬度和高程转换为世界坐标
        destination: Cesium.Cartesian3.fromDegrees(...centre),
        orientation: {
          // 指向
          heading: Cesium.Math.toRadians(0, 0),
          // 视角
          pitch: Cesium.Math.toRadians(-90),
          roll: 0.0,
        },
      })
      //创建一个鼠标操作
      const handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas) //此方法获取鼠标点击位置经纬度
      //给鼠标setAction
      handler.setInputAction((e) => {
        this.isPop = false
        console.log('e', e)
        const position = viewer.scene.pickPosition(e.position)
        console.log('position', position)
        //将笛卡尔坐标转化为经纬度坐标
        const cartographic = Cesium.Cartographic.fromCartesian(position)
        const longitude = Cesium.Math.toDegrees(cartographic.longitude)
        const latitude = Cesium.Math.toDegrees(cartographic.latitude)
        const height = cartographic.height

        console.log(e)
        console.log(longitude, latitude, height)

        var pick = viewer.scene.pick(e.position)
        var ray = viewer.camera.getPickRay(e.position)
        console.log(pick, ray)
        console.log(new Cesium.Cartesian2(e.position.x, e.position.y))
        const cartesian2 = new Cesium.Cartesian2(e.position.x, e.position.y)
        if (pick && pick.id) {
          // console.log(111)
          this.isPop = true
          this.styleObj.top = cartesian2.y - 500 + 'px'
          this.styleObj.left = cartesian2.x - 100 + 'px'
          console.log(this.styleObj)
        }
        // viewer.entities.remove(entityBill)

        // viewer.entities.removeAll() 全部删除
        // viewer.camera.setView({
        //   //定位到范围中心点
        //   destination: Cesium.Cartesian3.fromDegrees(Number(longitude), Number(latitude), 2000),
        //   orientation: {
        //     heading: Cesium.Math.toRadians(180), //1
        //     pitch: Cesium.Math.toRadians(-90),
        //     roll: 0,
        //   },
        // })
      }, Cesium.ScreenSpaceEventType.LEFT_CLICK)

      // 鼠标滚轮操作地图缩小放大
      viewer.scene.screenSpaceCameraController.zoomEventTypes = [
        Cesium.CameraEventType.WHEEL,
        Cesium.CameraEventType.PINCH,
      ]

      //鼠标右键旋转地图
      viewer.scene.screenSpaceCameraController.tiltEventTypes = [
        Cesium.CameraEventType.PINCH,
        Cesium.CameraEventType.RIGHT_DRAG,
      ]

      viewer.entities.add(this.AddEntityBill(point2))
      viewer.entities.add(this.AddEntityPoint(point1))
    },
    /**
     * @description: 模型高度差调节
     * @param {*} height  高度
     * @param {*} tileset  new的模型
     * @return {*}
     */
    changeHeight(height, tileset) {
      console.log()
      height = Number(height)
      if (isNaN(height)) {
        return
      }
      var cartographic = Cesium.Cartographic.fromCartesian(tileset.boundingSphere.center)
      var surface = Cesium.Cartesian3.fromRadians(
        cartographic.longitude,
        cartographic.latitude,
        cartographic.height
      )
      var offset = Cesium.Cartesian3.fromRadians(
        cartographic.longitude,
        cartographic.latitude,
        height
      )
      var translation = Cesium.Cartesian3.subtract(offset, surface, new Cesium.Cartesian3())
      tileset.modelMatrix = Cesium.Matrix4.fromTranslation(translation)
    },

    /**
     * @description: 地图添加点
     * @param {*} params //经纬度信息
     * @return {*}
     */
    AddEntityBill(point) {
      const entityBill = new Cesium.Entity({
        id: `${Math.random()}点`,
        name: '点',
        show: true,
        position: Cesium.Cartesian3.fromDegrees(...point),
        billboard: new Cesium.BillboardGraphics({
          // 图像地址，URI或Canvas的属性
          image: require('@/assets/indexImg/5G云诊室D-X.png'),
          // 设置颜色和透明度
          color: Cesium.Color.WHITE.withAlpha(1),
          // 高度（以像素为单位）
          height: 64,
          // 宽度（以像素为单位）
          width: 29,
          // 逆时针旋转
          rotation: 0,
          // 大小是否以米为单位
          sizeInMeters: false,
          // 相对于坐标的垂直位置
          verticalOrigin: Cesium.VerticalOrigin.CENTER,
          // 相对于坐标的水平位置
          horizontalOrigin: Cesium.HorizontalOrigin.LEFT,
          // 该属性指定标签在屏幕空间中距此标签原点的像素偏移量
          pixelOffset: new Cesium.Cartesian3(0, 0, 0),
          // 应用于图像的统一比例。比例大于会1.0放大标签，而比例小于会1.0缩小标签。
          scale: 1.0,
          // 是否显示
          show: true,
        }),
      })
      return entityBill
    },

    AddEntityPoint(point) {
      const entityPoint = new Cesium.Entity({
        id: `${Math.random()}点`,
        name: '点1',
        show: true,
        position: Cesium.Cartesian3.fromDegrees(...point),
        point: new Cesium.PointGraphics({
          show: true,
          pixelSize: 15,
          heightReference: Cesium.HeightReference.NONE,
          color: new Cesium.Color(255, 255, 0, 1),
          outlineColor: new Cesium.Color(0, 0, 0, 0),
          outlineWidth: 0,
          scaleByDistance: new Cesium.NearFarScalar(0, 1, 5e10, 1),
          translucencyByDistance: new Cesium.NearFarScalar(0, 1, 5e10, 1),
          distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0, 4.8e10),
        }),
      })
      return entityPoint
    },
  },
}
</script>

<style scoped>
#cesiumContainer {
  position: absolute;
  top: 0;
  left: 0;
  margin: 0;
  width: 100%;
  height: 100%;
}
</style>
