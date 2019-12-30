<template>
  <page-layer :is-show="isShow">
    <div slot="headerPlus" class="header-plus">
      <h3 class="header-plus-title">选择入住时间和退房时间</h3>
      <p class="header-plus-remind">Some reminders to remind the user</p>
      <ul class="header-plus-week">
        <li class="header-plus-week-day" v-for="day in ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat']" :key="day">
          {{'fnb.week.' + day | local}}
        </li>
      </ul>
    </div>
    <div class="calendar-main">
      <div class="calendar-info" v-for="(month, monthTitle) in calendars" :key="monthTitle">
        <h5 class="calendar-month-title">{{monthTitle}}</h5>
        <ul class="calendar-month-info" @click="chooseDate(month, $event.target)">
          <li class="calendar-date" :key="day"
            v-for="(date, day) in month"
            :data-date="day"
            :class="date.status"
            >{{date && date.$D}}</li>
        </ul>
      </div>
    </div>
  </page-layer>
</template>

<script>
// import PageLayer from '../../PageLayer.vue'
import PageLayer from '../components/input/PageLayer.vue'
import dayjs from 'dayjs';
import dateRangePickerLocale from './locale.js';
const local = dateRangePickerLocale[window.KLK_LANG] || dateRangePickerLocale['en']
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
    chooseDate(month, element) {
      const date = month[element.getAttribute('data-date')]
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
      date.status = 'checked'
      if (this.selectedDates.length === multiple) {
        this.$emit('confirm', this.selectedDates)
      }
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
      window.KLK_LANG = "zh"
      let lang = ['en', 'zh', 'zh', 'ko', 'ja'].find(lang => window.KLK_LANG.includes(lang))
      if (!lang) {
        const {monthNames} = local
        return day => monthNames[day.get('month')] + ' ' + day.get('year')
      } else {
        let {titleFormat} = local
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
      /**
       * 只有在范围选择（多选为2）中才会去计算 包含 选中开始日期后过滤日期
       * 选中一个日期 => 执行 选中开始日期后冻结筛选失败的日期标记（freeze） 和 去掉包含标记（between）
       * 选中两个个日期 => 执行 增加包含标记（between）和去掉选中开始日期后的冻结标记（freeze）
       * 每次选择日期只遍历一次数据计算样式 只操作有变化的数据 虽然有点麻烦 逻辑复杂 但是 大大减少额外的性能开销 避免了卡顿
       */
      this.$watch('selectedDates', function (selectedDates) {
        const [start_date] = selectedDates
        // 不存在等于0的情况
        const doFreeze = selectedDates.length === 1
        if(!doFreeze) {
          /**
           *  这里是selectedDates.length === 2 的情况 给每一项手动加的状态 选中 并且包含的class="checked (checked-left || checke-right)"
           * 
           * 如果使用响应式 让框架自己去计算是不是 选中并包含的状态 需要很长的表达式 且每一项都会去执行这个表达式
           * <li
           *    v-for="(date, day) in month"
           *    :data-date="day"
           *    class="calendar-date"
           *    :class="[date.status, multiple ===2 && selectedDates.length === 2 && date.status === 'checked' && `checked-${['left', 'right'][selectedDates.indexOf(date)]}`]"
           * >
           */
          const classList = ['left', 'right']
          selectedDates.forEach((date, index) => date.status += ` checked-${classList[index]}`)
        }
        for (const monthTitle in this.calendars) {
          const month = this.calendars[monthTitle]
          for (const dateFormat in month) {
            const date = month[dateFormat];
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
        }
      })
    }
  },
  data() {
    return {
      calendars: {},
      isShow: true,
      selectedDates: []
      
    }
  },
  filters: {
    local: window.__
  },
  components: {PageLayer}
}
</script>
<style lang="scss" scoped>
* {
  margin: 0;
  padding: 0;
}
ul{
  list-style-type: none;
}
.header-plus {
  &-title {
    line-height: 64px;
    color: #ff5722;
    font-size: 20px;
    font-weight: 600;
  }
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
        text-align: center;
        box-sizing: content-box;
        height: 32px;
        line-height: 32px;
        padding: 8px 0;
        background-clip: content-box;
        &.disabled,
        &.freeze {
          color: rgba(0, 0, 0, 0.24);
        }
        &.between {
          background-color: #ffbca7;
          color: #fff;
        }
        &.checked {
          color: #fff;
          background-image: radial-gradient(circle, #ff5722 16px, transparent 16px);
          &-left {
            background-image: radial-gradient(circle, #ff5722 16px, transparent 16px),
                linear-gradient(to right, transparent 50%, #ffbca7 50%);
          }
          &-right {
            background-image: radial-gradient(circle, #ff5722 16px, transparent 16px),
                linear-gradient(to left, transparent 50%, #ffbca7 50%);
          }
        }
      }
    }
  }
}
</style>