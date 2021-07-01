/*
 * @Author: carl
 * @Date: 2021-06-29 11:07:59
 * @LastEditTime: 2021-06-29 19:30:02
 * @Description:坐标系转化
 * @FilePath: \vue-admin-antdv\src\utils\coordinate.js
 * @Email: caiyunfeng@jxhsja.com
 * 嘉兴海视嘉安智城科技有限公司
 */
const PI = Math.PI
const a = 6378245.0 //  a: 卫星椭球坐标投影到平面地图坐标系的投影因子。
const ee = 0.00669342162296594323 //  ee: 椭球的偏心率。

/**
 * 百度坐标系 (BD-09) 与 火星坐标系 (GCJ-02)的转换
 * 即 百度 转 谷歌、高德
 * @param bd_lon
 * @param bd_lat
 * @param bd_z
 * @returns {*[]}
 */
export function bd09togcj02(bd_lon, bd_lat, bd_z = 0) {
  var x_pi = (PI * 3000.0) / 180.0
  var x = bd_lon - 0.0065
  var y = bd_lat - 0.006
  var z = Math.sqrt(x * x + y * y) - 0.00002 * Math.sin(y * x_pi)
  var theta = Math.atan2(y, x) - 0.000003 * Math.cos(x * x_pi)
  var gg_lng = z * Math.cos(theta)
  var gg_lat = z * Math.sin(theta)
  return [gg_lng, gg_lat, bd_z]
}

/**
 * 高德 GCJ02 转换为 WGS84 CGCS2000
 * 即 谷歌、高德 转 agcgis 天地图 GPS
 * @param lng
 * @param lat
 * @param gcj_z
 * @returns {*[]}
 */
export function gcj02towgs84(lng, lat, gcj_z = 0) {
  if (_out_of_china(lng, lat)) {
    return [lng, lat, gcj_z]
  } else {
    let dlat = _transformlat(lng - 105.0, lat - 35.0)
    let dlng = _transformlng(lng - 105.0, lat - 35.0)
    let radlat = (lat / 180.0) * PI
    let magic = Math.sin(radlat)
    magic = 1 - ee * magic * magic
    let sqrtmagic = Math.sqrt(magic)
    dlat = (dlat * 180.0) / (((a * (1 - ee)) / (magic * sqrtmagic)) * PI)
    dlng = (dlng * 180.0) / ((a / sqrtmagic) * Math.cos(radlat) * PI)
    let mglat = lat + dlat
    let mglng = lng + dlng
    return [lng * 2 - mglng, lat * 2 - mglat, gcj_z]
  }
}

function _transformlat(lng, lat) {
  let ret =
    -100.0 +
    2.0 * lng +
    3.0 * lat +
    0.2 * lat * lat +
    0.1 * lng * lat +
    0.2 * Math.sqrt(Math.abs(lng))
  ret += ((20.0 * Math.sin(6.0 * lng * PI) + 20.0 * Math.sin(2.0 * lng * PI)) * 2.0) / 3.0
  ret += ((20.0 * Math.sin(lat * PI) + 40.0 * Math.sin((lat / 3.0) * PI)) * 2.0) / 3.0
  ret += ((160.0 * Math.sin((lat / 12.0) * PI) + 320 * Math.sin((lat * PI) / 30.0)) * 2.0) / 3.0
  return ret
}

function _transformlng(lng, lat) {
  let ret =
    300.0 + lng + 2.0 * lat + 0.1 * lng * lng + 0.1 * lng * lat + 0.1 * Math.sqrt(Math.abs(lng))
  ret += ((20.0 * Math.sin(6.0 * lng * PI) + 20.0 * Math.sin(2.0 * lng * PI)) * 2.0) / 3.0
  ret += ((20.0 * Math.sin(lng * PI) + 40.0 * Math.sin((lng / 3.0) * PI)) * 2.0) / 3.0
  ret += ((150.0 * Math.sin((lng / 12.0) * PI) + 300.0 * Math.sin((lng / 30.0) * PI)) * 2.0) / 3.0
  return ret
}

/**
 * 判断是否在国内，不在国内则不做偏移
 * @param lng
 * @param lat
 * @returns {boolean}
 */
function _out_of_china(lng, lat) {
  // 纬度3.86~53.55,经度73.66~135.05
  return !(lng > 73.66 && lng < 135.05 && lat > 3.86 && lat < 53.55)
}
