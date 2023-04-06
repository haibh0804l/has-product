import { faExpand, faRefresh } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Card, Col, Empty, Layout, Row, Segmented, Space, Tooltip } from 'antd'
import { useEffect, useState } from 'react'
import { getCookie } from 'typescript-cookie'
import { PersonalScoreRequest } from '../../data/database/Report'
import { useAppDispatch, useAppSelector } from '../../redux/app/hook'
import { fetchPersonalScore } from '../../redux/features/report/personalScoreSlice'

interface PersonalScoreInput {
  reloadCount: number
  department: string
}

const PersonalScore: React.FC<PersonalScoreInput> = ({
  reloadCount,
  department,
}) => {
  const [value, setValue] = useState<string | number>('This month')
  const [hideTooltip, setHideTooltip] = useState(false)
  const [reload, setReload] = useState(reloadCount)
  const [personalScoreReq, setPersonalScoreReq] =
    useState<PersonalScoreRequest>({
      userId: getCookie('user_id')!,
      department: department,
      baseOnMonth: 1,
    })
  const [score, setScore] = useState('')
  const [rank, setRank] = useState('')
  const [total, setTotal] = useState('')
  const [spin, setSpin] = useState(false)
  const myScore = useAppSelector((state) => state.personalScore.score)
  const personalScore = useAppSelector((state) => state.personalScore)
  const dispatch = useAppDispatch()

  useEffect(() => {
    setReload(reload + 1)
  }, [])

  useEffect(() => {
    dispatch(fetchPersonalScore(personalScoreReq))
  }, [reload, reloadCount])

  useEffect(() => {
    if (!personalScore.loading && personalScore.score.length !== undefined) {
      if (personalScore.score.length === 0) {
        setHideTooltip(true)
      } else {
        setHideTooltip(false)
        setScore(personalScore.score[0].TotalScore!.toString())
        setRank(personalScore.score[0].Rank!.toString())
        setTotal(personalScore.score[0].UserCount!.toString())
      }
    }
    setSpin(false)
  }, [personalScore.loading, personalScore.score.length])

  const OnChangeFilter = (e: string) => {
    setValue(e)
    if (e === 'This week') {
      setPersonalScoreReq({
        ...personalScoreReq,
        baseOnWeek: 1,
        baseOnMonth: 0,
        baseOnYear: 0,
      })
    } else if (e === 'This month') {
      setPersonalScoreReq({
        ...personalScoreReq,
        baseOnMonth: 1,
        baseOnWeek: 0,
        baseOnYear: 0,
      })
    } else {
      setPersonalScoreReq({
        ...personalScoreReq,
        baseOnWeek: 0,
        baseOnMonth: 0,
        baseOnYear: 1,
      })
    }
    setReload(reload + 1)
  }

  return (
    <Card
      title="Personal Score"
      style={{ width: '100%' }}
      headStyle={{ backgroundColor: '#eeeeee' }}
      extra={
        <>
          <FontAwesomeIcon
            icon={faRefresh}
            spin={spin}
            size="lg"
            style={{ marginRight: '10px', cursor: 'pointer' }}
            onClick={() => {
              setSpin(true)
              setReload(reload + 1)
            }}
          />
          {/* <FontAwesomeIcon icon={faExpand} size="lg" /> */}
        </>
      }
    >
      <div style={{ marginBottom: '10%' }}>
        <Space
          direction="horizontal"
          align="center"
          style={{
            float: 'right',
            marginBottom: '10px',
            width: 'auto',
            // color: '#0e7490',
          }}
        >
          <p style={{ float: 'left', width: 'auto' }}></p>
          <Segmented
            options={['This week', 'This month', 'This year']}
            value={value}
            style={{ background: '#9CA3AF', color: '#000000' }}
            onChange={(e) => {
              OnChangeFilter(e.toString())
            }}
          />
          {/* <ExportMenu /> */}
        </Space>
      </div>

      {hideTooltip === false ? (
        <p style={{ fontSize: '90px', textAlign: 'center' }}>
          <Tooltip
            title={'Bạn đang xếp hạng ' + rank + '/' + total + ' trong phòng'}
            color="#eeeeee"
            placement="left"
            overlayInnerStyle={{ color: 'black' }}
          >
            {score}
          </Tooltip>
        </p>
      ) : (
        <center>
          <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
        </center>
      )}
    </Card>
  )
}

export default PersonalScore
