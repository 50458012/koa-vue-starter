<template>
  <page-layer :is-show="isShow">
    <p slot="header">789789789789789789789</p>
    <div class="calendar-main">
      <div class="calendar-info" v-for="(month, monthTitle) in calendars" :key="monthTitle">
        <h5 class="calendar-month-title">{{getMonthTitle(monthTitle)}}</h5>
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
window.KLK_LANG = 'vi'
export default {
  name: 'page-calendar',
  props: {
    /**
     * @props timeLimit {[String,  Number, Object, Array]}
     * String 1. format as 'YYYY-MM-DD' => [today, your date] 2. '3month' or '3month+18day' => [today, today + your date]
     * Number => [today, today + your number days]
     * Object => must be instead of dayjs
     * Array => [<String|Number|Object>] length must be two
     * default => [tiday, today + 30days]
     */
    timeLimit: {
      type: [String, Number, Object, Array],
      default: "1month+1month+1month"
    },
    multiple: {
      type: Number,
      default: 2
    },
    checkedDisablFn: {
      type:Function,
      default: (date, start_date) => Math.abs(date.diff(start_date, 'day')) > 5
    }
  },
  // watch: {
  //   selectedDates(newArr, oldArr) {
  //     if (newArr.length) {
        
  //     }
  //   }
  // },
  methods: {
    chooseDate(month, {target}) {
      debugger
      const {freeze, between} = this.match
      const date = month[target.getAttribute('data-date')]
      if (!date || ['disabled', 'freeze', 'checked'].includes(date.status)) return
      const {length} = this.selectedDates
      if (!length || length === this.multiple || this.multiple === 1) {
        if (length) {
          between && length === 2 && this.checkBetween(false)
          this.selectedDates.forEach(item => item.status = '')
        }
        this.selectedDates = [date]
        freeze && this.checkFreeze(true)
      } else {
        this.selectedDates.push(date)
      }
      date.status = 'checked'
      if (this.selectedDates.length === this.multiple) {
        this.$nextTick(() => this.$emit('confirm', this.selectedDates))
        freeze && this.checkFreeze(false)
        between && this.checkBetween(true)
        // this.isShow = false

      }
    },
    checkBetween(status = '') {
      debugger
      let [start_date, end_date] = this.selectedDates.map(date => date.format('YYYY-M-D'))
      let [, monthKey, date] = start_date.split(/^(\d{4}-\d+)-(\d+)/)
      date = +date
      while (monthKey in this.calendars) {
        const monthData = this.calendars[monthKey]
        while((start_date = `${monthKey}-${++date}`) in monthData) {
            if (start_date === end_date) {
              return
            }
            monthData[start_date].status = status && 'between'
        }
        let [year, month] = monthKey.split("-").map(Number)
          if (++month > 12) {
            month = 1
            year++
          }
          date = 0
          monthKey = [year, month].join('-')
      }
    },
    /**
     * @param status {Boolean}
     *  1. true  执行checkedDisablFn 为真 执行结果为true date.status => 'freeze'
     *  2. false 释放被冻结的日期 date.status => ''
     */
    checkFreeze(status) {
      Object.values(this.calendars)
        .forEach(month => Object.values(month)
          .forEach(date => {
            if (date && date.status !== 'disabled') {
              if (status) {
                if(!date.status && this.checkedDisablFn(date, this.selectedDates[0])){
                  date.status = 'freeze'
                }
              } else if (date.status === 'freeze') {
                  date.status = ''
              }
            }
          }
        )
      )
    }
  },
  computed: {
    match() {
      const {length} = this.selectedDates
      return {
        freeze: this.checkedDisablFn && this.multiple > 1,
        between: this.multiple === 2
      }
    },
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
    },
    getMonthTitle(){
      let lang = ['en', 'zh', 'zh', 'ko', 'ja'].find(lang => window.KLK_LANG.includes(lang))
      if (!lang) {
        const {monthNames} = this.local
        const reg = /^(\d{4})-(\d+)/, regFn = (str, year, month) => monthNames[month - 1] + ' ' + year
        return day => day.replace(reg, regFn)
      } else {
        let {titleFormat} = this.local
        if (lang === 'en') {
          titleFormat = titleFormat.replace('MM', 'MMM')
        } else {
          titleFormat = titleFormat.replace('mm', 'M')
        }
        return day => dayjs(day, 'YYYY-M').format(titleFormat)
      }
    }
  },
  created(){ 
      const  disabledFn = date => Object.assign(date, {
        status: ['Before', 'After'].findIndex((method, index) => date['is' + method](this.limitTime[index])) > -1 ? 'disabled' : ''
      }), calendars = {}
      let [start_date, end_date] = this.limitTime;
      start_date = start_date.date(1)
      while (!start_date.isAfter(end_date, 'month')) {
        const months = {}
        const lastMonthDate = start_date.subtract(1, 'day')
        let weekDay = start_date.day()
        while (weekDay--) {
          months[lastMonthDate.subtract(weekDay, 'day').format('YYYY-M-D')] = ''
        }
        for (let date = 1, daysInMonth = start_date.daysInMonth(); date <= daysInMonth; date++) {
          const day = disabledFn(start_date.date(date))
          months[day.format('YYYY-M-D')] = day
        }
        calendars[start_date.format('YYYY-M')] = months
        start_date = start_date.add(1, 'month')
      }
      this.calendars = calendars
      console.log(calendars);
      
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