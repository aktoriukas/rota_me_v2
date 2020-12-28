function WeekDays (props) {

    const {monday} = props;

    let tuesday = new Date(monday);
    let wednesday = new Date(monday);
    let thursday = new Date(monday);
    let friday = new Date(monday);
    let saturday = new Date(monday);
    let sunday = new Date(monday);

    tuesday = tuesday.addDays(1)
    wednesday = wednesday.addDays(2)
    thursday = thursday.addDays(3)
    friday = friday.addDays(4)
    saturday = saturday.addDays(5)
    sunday = sunday.addDays(6)

    return (
        <ul className='weekdays'>
            <li>
                <div className='day'>Monday</div>
                <div className='date'>
                    {`${monday.getMonth() + 1}-${monday.getDate()}`}
                </div>
            </li>
            <li>
                <div className='day'>Tuesday</div>
                <div className='date'>
                    {`${tuesday.getMonth() + 1}-${tuesday.getDate()}`}
                </div>
            </li>
            <li>
                <div className='day'>Wednesday</div>
                <div className='date'>
                    {`${wednesday.getMonth() + 1}-${wednesday.getDate()}`}
                </div>
            </li>
            <li>
                <div className='day'>Thursday</div>
                <div className='date'>
                    {`${thursday.getMonth() + 1}-${thursday.getDate()}`}
                </div>
            </li>
            <li>
                <div className='day'>Friday</div>
                <div className='date'>
                    {`${friday.getMonth() + 1}-${friday.getDate()}`}
                </div>
            </li>
            <li>
                <div className='day'>Saturday</div>
                <div className='date'>
                    {`${saturday.getMonth() + 1}-${saturday.getDate()}`}
                </div>
            </li>
            <li>
                <div className='day'>Sunday</div>
                <div className='date'>
                    {`${sunday.getMonth() + 1}-${sunday.getDate()}`}
                </div>
            </li>
        </ul>
    )
}
export default WeekDays;