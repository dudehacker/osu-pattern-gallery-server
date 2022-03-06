const beatmapService = require("../service/beatmapService");
const chai = require("chai")
var assert = chai.assert;

const rankedMap = {
  mode:"Mania",
  approvalStatus: "Ranked",
};

const lovedMap = {
  mode:"Mania",
  approvalStatus: "Loved",
};


describe('get beatmap api', function() {
    it('valid betamap id should return beatmap', function() {
      return beatmapService.getMapData("3223324").
        then(mapData => {
            console.debug(mapData)
           return assert.isNotNull(mapData,JSON.stringify(mapData))
        }  );
    });
    it('invalid betamap id should return null', function() {
        return beatmapService.getMapData("asdasd").
          then(mapData => {
             return assert.isNull(mapData)
          }  );
      });
  });

describe("get beatmap ID from map URL", () => {
  it("no param should return null", () => {
    assert.equal(beatmapService.getMapIdFromLink("qwewqeww"), null);
  });
  it("null should return null", () => {
    assert.equal(beatmapService.getMapIdFromLink(null), null);
  });
  it("object should return null", () => {
    assert.equal(beatmapService.getMapIdFromLink({aa:"qweqw"}), null);
  });
  it("random URL should return null", () => {
    assert.equal(beatmapService.getMapIdFromLink("https://github.com/ppy/osu-api/wiki#beatmap"), null);
  });
  it("imcomplete beatmap URL should return null", () => {
    assert.equal(beatmapService.getMapIdFromLink("https://osu.ppy.sh/beatmapsets/1578629"), null);
  });
  it("https://osu.ppy.sh/beatmapsets/1578629#mania/3223324 should return 3223324", () => {
    assert.equal(beatmapService.getMapIdFromLink("https://osu.ppy.sh/beatmapsets/1578629#mania/3223324"), "3223324");
  });
});

describe("check valid map for upload", () => {
  it("no param should be invalid", () => {
    assert.equal(beatmapService.isValidMap(), false);
  });
  it("undefined should be invalid", () => {
    assert.equal(beatmapService.isValidMap(undefined), false);
  });
  it("empty object should be invalid", () => {
    assert.equal(beatmapService.isValidMap({}), false);
  });
  it("null approvalStatus should be invalid", () => {
    assert.equal(beatmapService.isValidMap({ approvalStatus: null }), false);
  });
  it("taiko map should be invalid", () => {
    assert.equal(beatmapService.isValidMap({
      mode: "Taiko"
    }), false);
  });
  it("ranked map should be true", () => {
    assert.equal(
      beatmapService.isValidMap(rankedMap),
      true,
      JSON.stringify(rankedMap)
    );
  });
  it("loved map should be true", () => {
    assert.equal(
      beatmapService.isValidMap(lovedMap),
      true,
      JSON.stringify(lovedMap)
    );
  });
});
