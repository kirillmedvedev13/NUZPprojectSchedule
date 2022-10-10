export default function SortSchedule(schedule) {
  schedule.sort((schedule1, schedule2) => {
    if (schedule1.number_pair > schedule2.number_pair) return 1;
    else if (schedule1.number_pair === schedule2.number_pair) {
      if (schedule1.pair_type > schedule2.pair_type) return 1;
      else if (schedule1.pair_type === schedule2.pair_type) {
        if (schedule1.day_week > schedule2.day_week) return 1;
        else if (schedule1.day_week === schedule2.day_week) {
          return 0;
        } else return -1;
      } else return -1;
    } else return -1;
  });
}
