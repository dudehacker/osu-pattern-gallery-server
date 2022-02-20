const beatmapService = require("./service/beatmapService")

var validMap = {}

beatmapService.getMapData("3161129").then(
    (map) => {
        console.log(map[0])
        validMap = map[0]
        if (map[0].approvalStatus == beatmapService.RankedStatus.RANKED){
            console.log("map is ranked!")
        }
    }
);