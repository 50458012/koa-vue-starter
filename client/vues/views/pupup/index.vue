<template>
  <page-layer :is-show="isShow">
    <p slot="header">789789789789789789789</p>
    <div class="calendar-main">
      <div class="calendar-info" v-for="(month, monthTitle) in calendars" :key="monthTitle">
        <h5 class="calendar-month-title">{{monthTitle}}</h5>
        <!-- // 事件委派  提升性能 减少卡顿 -->
        <ul class="calendar-month-info" @click="chooseDate(month, $event)">
          <li class="calendar-date" :key="day"
            :data-date="day"
            v-for="(date, day) in month"
            :class="date.status"
          >{{date && date.$D}}</li>
        </ul>
      </div>
    </div>
  </page-layer>
  
</template>

<script>
import PageLayer from '../components/input/PageLayer.vue'
import dayjs from 'dayjs';
import dateRangePickerLocale from './locale.js';
window.KLK_LANG = 'zh-CN'
export default {
  name: 'page-calendar',
  props: {
    /**
     * @props timeLimit <String,  Number, Object, Array>
     * String:
     *        1. format as 'YYYY-MM-DD' => [today, your date], 
     *        2. '3month' or '3month+18day' => [today, today + your date]
     * Number => [today, today + your number days]
     * Object => must be instead of dayjs
     * Array => [<String|Number|Object>] length must be two
     * default => [tiday, today + 30days]
     */
    timeLimit: {
      type: [String, Number, Object, Array],
      default: "6month+29day"
    },
    multiple: {
      type: Number,
      default: 2
    },
    checkedDisablFn: {
      type:Function,
      default: (date, start_date) => Math.abs(date.diff(start_date, 'day')) > 30
    }
  },
  methods: {
    chooseDate(month, {target}) {
      const date = month[target.getAttribute('data-date')]
      if (!date || ['disabled', 'freeze'].includes(date.status)) return
      const {multiple} = this
      if (this.selectedDates.length === multiple) {
        this.selectedDates.forEach(item => item.status = '')
        this.selectedDates = [date]
      } else if (date.status !== 'checked') {
        let method = 'push'
        if (multiple === 2 && this.selectedDates.length === 1 && date.isBefore(this.selectedDates[0], 'day')) {
          method = 'unshift'
        }
        this.selectedDates[method](date)
      }
      this.$nextTick(() => {
        date.status = 'checked'
        this.selectedDates.length === multiple && this.$emit('confirm', this.selectedDates)
        // this.isShow = false
      })
    }
  },
  computed: {
    limitTime () {
      const today = dayjs()
      const checkProps = (prop, count = 30) => {
        switch (typeof prop) {
          case 'string':
            if (/^\d{4}(-\d{2}){2}$/.test(prop)) {
              return  dayjs(prop)
            } else if (/^\d+\w+(\+\d+\w+)*$/.test(prop)) {
              return prop.split('+')
                .map(expression => expression.split(/(\d+)/))
                .reduce((res, expression) => res.add(...expression.slice(1))
              , today)
            }
            return today.add(count, 'day')
          case 'number':
            return today.add(prop, 'day')
          default:
            return dayjs.isDayjs(prop)
                    ? prop
                    : today.add(count, 'day')
        }
      }
      return Array.isArray(this.timeLimit)
              ? this.timeLimit.map(checkProps)
              : [today, checkProps(this.timeLimit)]
    }
  },
  created(){
    const calendars = {}
    const getMonthTitle = (() => {
      let lang = ['en', 'zh', 'zh', 'ko', 'ja'].find(lang => window.KLK_LANG.includes(lang))
      if (!lang) {
        const {monthNames} = this.local
        return day => monthNames[day.get('month')] + ' ' + day.get('year')
      } else {
        let {titleFormat} = this.local
        if (lang === 'en') {
          titleFormat = titleFormat.replace('MM', 'MMM')
        } else {
          titleFormat = titleFormat.replace('mm', 'M')
        }
        return day => day.format(titleFormat)
      }
    })()
    const isBetween = (date, date_arr) => ['Before', 'After'].findIndex((method, index) => date['is' + method](date_arr[index])) < 0
    let [start_date, end_date] = this.limitTime;
    start_date = start_date.date(1)
    while (!start_date.isAfter(end_date, 'month')) {
      const months = {}
      const lastMonthDate = start_date.subtract(1, 'day')
      let weekDay = start_date.day()
      while (weekDay--) {
        months[lastMonthDate.subtract(weekDay, 'day').format('YYYY-MM-DD')] = ''
      }
      for (let date = 1, daysInMonth = start_date.daysInMonth(); date <= daysInMonth; date++) {
        const day = start_date.date(date)
        day.status = isBetween(day, this.limitTime) ? '' : 'disabled'
        months[day.format('YYYY-MM-DD')] = day
      }
      calendars[getMonthTitle(start_date)] = months
      start_date = start_date.add(1, 'month')
    }
    this.calendars = calendars

    if(this.multiple === 2) {
      // 每次 选择日期只遍历一次去手动计算状态 减少卡顿
      this.$watch('selectedDates', function (selectedDates) {
        const [start_date] = selectedDates
        const doFreeze = selectedDates.length === 1
        Object.values(this.calendars)
          .forEach(month => Object.values(month)
            .forEach(date => {
              if (date && date.status !== 'disabled') {
                if (doFreeze) {
                  if (this.checkedDisablFn && this.checkedDisablFn(date, start_date)) {
                    date.status = 'freeze'
                  } else if (date.status === 'between') {
                    date.status = ''
                  }
                } else if (date.status === 'freeze') {
                  date.status = ''
                } else if (!date.status && isBetween(date, selectedDates)) {
                  date.status = 'between'
                }
              }
            }
          )
        )
      })
    }
  },
  data() {
    return {
      calendars: {},
      isShow: true,
      selectedDates: [],
      local: Object.freeze(dateRangePickerLocale[window.KLK_LANG] || dateRangePickerLocale['en'])
    }
  },
  components: {PageLayer}
}
</script>
<style lang="scss" scoped>
* {
  margin: 0;
  padding: 0;
}
ul {
  list-style-type: none;
}
.calendar-main {
  .calendar-info {
    .calendar-month-title {
      line-height: 60px;
        font-size: 16px;
        font-weight: 600;
        text-indent: 16px;
    }
    .calendar-month-info {
      display: flex;
      flex-wrap: wrap;
      .calendar-date{
        flex: 0 0 (100%/7);
        line-height: 48px;
        text-align: center;
        &.disabled {
          background-color: #eee;
        }
        &.freeze {
          background-color: lightblue;
        }
        &.checked {
          background-color: #bfc;
        }
        &.between {
          background-color: yellowgreen;
        }
      }
    }
  }
}
</style>