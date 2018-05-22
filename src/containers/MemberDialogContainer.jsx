import React from 'react';
import PropTypes from 'prop-types';
import Dialog from 'material-ui/Dialog';
import RaisedButton from 'material-ui/RaisedButton';
import { Table, TableBody, TableRow, TableRowColumn } from 'material-ui/Table';
import TextField from 'material-ui/TextField';

export default class MemberDialogContainer extends React.Component {
  constructor(props) {
    super();
    this.state = {
      open: false,
      editable: false,
    };
    this.editedMemberData = { ...props.data };
  }

  handleOpen = () => {
    this.setState({ open: true });
  };

  handleClose = () => {
    this.setState({ open: false, editable: false });
  };

  handleAction = (action) => {
    this.props.handleAction(action, { id: this.props.data.id, data: this.editedMemberData });
    this.handleClose();
  }

  handleEdit = () => {
    this.setState({ editable: true });
  }

  handleChange = (event) => {
    this.editedMemberData[event.target.id] = event.target.value;
  }

  render() {
    const style = {
      margin: 6,
    };

    let actions = null;
    if (this.props.create) {
      actions = [
        <RaisedButton label="Cancel" style={style} key={1} onClick={this.handleClose} />,
        <RaisedButton label="Save" primary={true} style={style} onClick={() => this.handleAction('create')} key={2}/>,
      ];
    } else if (this.state.editable) {
      actions = [
        <RaisedButton label="Cancel" style={style} onClick={this.handleClose} key={0}/>,
        <RaisedButton label="Delete" primary={true} style={style} onClick={() => this.handleAction('delete')} key={1}/>,
        <RaisedButton label="Save" primary={true} style={style} onClick={() => this.handleAction('save')} key={2}/>,
      ];
    } else if (!this.state.editable) {
      actions = [
        <RaisedButton label="Edit" style={style} key={3} primary={true} onClick={this.handleEdit}/>,
        <RaisedButton label="Close" style={style} key={4} onClick={this.handleClose}/>,
      ];
    }

    const fields = [
      { key: 'name', label: 'Name', editable: true },
      { key: 'street', label: 'Street', editable: true },
      { key: 'houseNumber', label: 'House number', editable: true },
      { key: 'email', label: 'Email', editable: true },
      { key: 'status', label: 'Status', editable: true },
    ];

    if (!this.props.create) {
      fields.unshift({ key: 'id', label: 'ID', editable: false });
    }

    const tableRows = fields.map((field, index) => {
      let value = this.props.data[field.key];
      if ((this.state.editable && field.editable) || this.props.create) {
        value = <TextField id={field.key} defaultValue={value} onChange={this.handleChange}></TextField>;
      }
      return (
        <TableRow key={index}>
          <TableRowColumn>{field.label}</TableRowColumn>
          <TableRowColumn>{value}</TableRowColumn>
        </TableRow>);
    });

    return (
      <div>
        {React.cloneElement(this.props.children, { onClick: this.handleOpen })}
        <Dialog
          title="Member Details"
          actions={actions}
          modal={true}
          open={this.state.open}
          autoScrollBodyContent={true}
        >
          <Table>
            <TableBody displayRowCheckbox={false}>
              {tableRows}
            </TableBody>
          </Table>
        </Dialog>
      </div>
    );
  }
}

MemberDialogContainer.propTypes = {
  data: PropTypes.shape({
    id: PropTypes.number,
  }),
  handleAction: PropTypes.func,
  children: PropTypes.object,
  create: PropTypes.bool,
};