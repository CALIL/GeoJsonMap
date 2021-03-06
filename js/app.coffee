app =
  geojsons : {}
  getGeoJSONByLevel: (level)->
    geojson = @geojsons[level]
    # TODO:中心点を求める処理を入れる
    geojson.haika =
      xyLatitude: 35.1550682
      xyLongitude: 136.9637741
    return geojson
  loadGeoJSON : (option)->
    $.ajax
      url: """http://lab.calil.jp/haika_store/load.php?major=#{option.major}"""
      type: 'GET'
      cache: false
      dataType: 'json'
      error: ()=>
        option.error and option.error('データが読み込めませんでした')
      success: (data)=>
        option.success and option.success(data)
  initGeoJSON : (major)->
    @loadGeoJSON(
      major   : major
      success : (data)=>
        @geojsons = data.geojson
        levels = []
        for level, geojson of data.geojson
          levels.push(level)
        lev = levels[0]
        map.createLevelMenu(levels.reverse())
        # TODO: いまいる階を指定する
        map.loadFloorByLevel(lev)
      error   : (message)->
        alert(message)
    )


## テストコード

# フロアデータの呼び出し、majorを渡す
app.initGeoJSON(101)

# 地下

time = 0
#setTimeout ->
#  map.createUserLocation(164, 'marker-infowindow')
#,time+=2000
## 現在地の移動
#setTimeout ->
#  map.createUserLocation(165)
#,time+=2000
#
## 現在地の移動
#setTimeout ->
#  map.createUserLocation(166)
#,time+=2000

# 3Fへ移動
minor = 300
setTimeout ->
  map.loadFloorAndChangeShelfColor('3F', 298).then(=>
    map.createUserLocation(72, 'marker-infowindow')
#    map.createDestLocation(310, 'destination-infowindow')
  )

  time = 0
,time+=2000
#setTimeout ->
#  map.createUserLocation(72, 'marker')
#  map.createDestLocation(72, 'destination-infowindow')
#,time+=2000
#setTimeout ->
#  map.createUserLocation(72, 'marker')
#  map.createDestLocation(72, 'destination-infowindow')
#,time+=2000
#setTimeout ->
#  map.createUserLocation(72, 'marker-infowindow')
#  map.createDestLocation(72, 'destination')
#,time+=2000
#setTimeout ->
#  setLocation()
#,time+=2000
#  
## 現在地の移動
#setLocation = ()->
#  setTimeout ->
#    minor += 10
#    map.createUserLocation(minor, 'marker')
#    map.createDestLocation(minor-100, 'destination-infowindow')
#    map.changeShelfColor(minor-100)
#    if minor<385
#      setLocation()
#  , time+=1000
#
#

