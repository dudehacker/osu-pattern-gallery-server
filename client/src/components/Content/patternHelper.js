import moment from 'moment'

const formatLink = (text) => {
  return "osu://edit/" + text;
};

const formatCardTitle = (beatmap) => {
  return `${beatmap.artist} - ${beatmap.title} [${beatmap.version}] mapped by ${beatmap.creator}`;
};

const formatTimestamps = (timestamps) =>{
    return timestamps.split(" (")[0];
}

const formatUserProfile = (osuId) => {
  return `https://osu.ppy.sh/users/${osuId}`;
};

const getBeatmapUrl = (beatmap) => {
  return `https://osu.ppy.sh/beatmapsets/${beatmap.beatmapSetId}#mania/${beatmap.id}`;
};

const calculatePassRates = (pattern) => {
  const passRates = pattern.beatmap.counts.passes * 100.0 / pattern.beatmap.counts.plays
  return `${passRates.toFixed(2)}%`
}

const calculateLNRates = (pattern) => {
  const {slider, normal} = pattern.beatmap.objects
  const ratio =  slider * 100.0 / (slider + normal)
  return `${ratio.toFixed(2)}%`
}

const formatDate = (dateString) => {
  var date = new Date(dateString);
  var formatted = moment(date).format('MMMM D, YYYY');
  return formatted
}

export { formatLink, formatCardTitle, formatUserProfile, getBeatmapUrl , formatDate, calculatePassRates, calculateLNRates, formatTimestamps};
