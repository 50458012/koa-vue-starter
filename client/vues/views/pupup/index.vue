<template>
  <page-layer :is-show="isShow">
    <p slot="header">789789789789789789789</p>
    <div class="calendar-main">
      <div class="calendar-info" v-for="(month, monthTitle) in calendars" :key="monthTitle">
        <h5 class="calendar-month-title">{{getMonthTitle(monthTitle)}}</h5>
        // 事件委派  提升性能 减少卡顿
        <ul class="calendar-month-info" @click="chooseDate(monthTitle, $event)">
          <li class="calendar-date" :key="day"
            :data-date="date && day"
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
     * @props timeLimit {[String,  Number, Object, Array]}
     * String => must be format as 'YYYY-MM-DD' => [today, your date]
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
    checkedDisablFn: Function
  },
  watch: {
    selectedDates(newArr, oldArr) {
      if (newArr.length) {
        
      }
    }
  },
  methods: {
    chooseDate(title, {target}) {
      const {freeze, between} = this.match
      const date = this.calendars[title][target.getAttribute('data-date')]
      if (!date || ['disabled', 'freeze', 'checked'].includes(date.status)) return
      date.status = 'checked'
      const {length} = this.selectedDates
      if (!length || length === this.multiple || this.multiple === 1) {
        if (length) {
          between && length === 2 && this.checkBetween(false)
          this.selectedDates.forEach(item => item.checked = false)
        }
        this.selectedDates = [date]
        freeze && this.checkFreeze(true)
      } else {
        this.selectedDates.push(date)
      }
      if (this.selectedDates.length === this.multiple) {
        this.$nextTick(() => this.$emit('confirm', this.selectedDates))
        freeze && this.checkFreeze(false)
        between && this.checkBetween(true)
        // this.isShow = false

      }
    },
    checkBetween(status) {
      debugger
      let [start_date, end_date] = this.selectedDates.map(date => date.format('YYYY-MM-DD'))
      let monthKey
      while ((monthKey = start_date.slice(0, -3)) in this.calendars) {
        const monthData = this.calendars[monthKey]
        let date = +start_date.slice(-2)
        while(`${monthKey}-${++date}` in monthData) {
          start_date = `${monthKey}-${date}`
            if (start_date === end_date) {
              return
            }
            monthData[start_date].status = 'between' || ''
        }
        let [year, month] = monthKey.split("-").map(Number)
          if (++mongth > 11) {
            month = 0
            year++
          }
          start_date = [year, month, '01'].join('-')
      }
    },
    /**
     * @param status {Boolean} 修改date.freeze的值
     *  1. true  执行checkedDisablFn 冻结执行结果为true 的日期
     *  2. false 释放被冻结的日期
     */
    checkFreeze(status) {
      Object.values(this.calendars)
      .forEach(month => Object.values(month)
      .forEach(date => {
        if (date && date.status !== 'disabled') {
          if (status) {
            if(!date.status && this.checkedDisablFn(date, this.selectedDates)){
              date.status = 'freeze'
            }
          } else if (date.status === 'freeze') {
              date.status = ''
          }
        }
      }))
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
            } else if (/^\d+\w+[\+ | \-]\d+\w+$/.test(prop)) {
              debugger
              const result = prop.split(/([\+ | \-])/)
              
              let [method] = result.splice(1, 1)
              [start_expression, end_expression] = result.map(expression => expression.split(/(\d+)/).slice(1))
              if ([method] === '+') {
                method = 'add'
              } else {
                method = 'subtract'
              }
              return today.add(...start_expression)[method](...end_expression)
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
        return day => monthNames[day.get('month')] + ' ' + day.get('year')
      } else {
        let {titleFormat} = this.local
        if (lang === 'en') {
          titleFormat = titleFormat.replace('MM', 'MMM')
        } else {
          titleFormat = titleFormat.replace('mm', 'MM')
        }
        return day => dayjs(day, 'YYYY-MM').format(titleFormat)
      }
    }
  },
  created(){
      const  disabledFn = date => Object.assign(date, {
        status: ['Before', 'After'].findIndex((method, index) => date['is' + method](this.limitTime[index])) > -1 ? 'disabled' : ''
      }), calendars = {}
      let [start_date, end_date] = this.limitTime;
      while (!start_date.isAfter(end_date, 'month')) {
        const months = {}
        const key = start_date.format('YYYY-MM-00-')
        for (let index = 0, day = start_date.date(1).day(); index < day; index++) {
          months[key + index] = ''
        }
        for (let date = 1, daysInMonth = start_date.daysInMonth(); date <= daysInMonth; date++) {
          const day = disabledFn(start_date.date(date))
          months[day.format('YYYY-MM-DD')] = day
        }
        calendars[start_date.format('YYYY-MM')] = months
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
        &.checked {
          background-color: #bfc;
        }
      }
    }
  }
}
</style>