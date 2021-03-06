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

describe('validate osu timestamps', function() {
  it('valid timestamps should return true', function() {
    const isValid =  beatmapService.isValidOsuTimestamp("00:37:177 (37177|2,37177|0,37177|1,37270|6) -");
    assert.isTrue(isValid);
  });
  it('valid timestamps 2 should return true', function() {
    const isValid =  beatmapService.isValidOsuTimestamp("00:37:177 (37177|2) -");
    assert.isTrue(isValid);
  });
  it('valid timestamps 3 should return true', function() {
    const isValid =  beatmapService.isValidOsuTimestamp("00:37:177 (37177|2,37177|0,37177|1,37270|6) - ");
    assert.isTrue(isValid);
  });
  it('invalid timestamps should return false', function() {
    const isValid =  beatmapService.isValidOsuTimestamp("00:37:177 -");
    assert.isFalse(isValid);
  });
});


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
    assert.isNotNull(beatmapService.isValidMap());
  });
  it("undefined should be invalid", () => {
    assert.isNotNull(beatmapService.isValidMap(undefined));
  });
  it("empty object should be invalid", () => {
    assert.isNotNull(beatmapService.isValidMap({}));
  });
  it("null approvalStatus should be invalid", () => {
    assert.isNotNull(beatmapService.isValidMap({ approvalStatus: null }));
  });
  it("taiko map should be invalid", () => {
    assert.isNotNull(beatmapService.isValidMap({
      mode: "Taiko"
    }));
  });
  it("ranked map should be valid", () => {
    assert.equal(
      beatmapService.isValidMap(rankedMap),
      null,
      JSON.stringify(rankedMap)
    );
  });
  it("loved map should be valid", () => {
    assert.equal(
      beatmapService.isValidMap(lovedMap),
      null,
      JSON.stringify(lovedMap)
    );
  });
});
